"""Executed content-assessment tests, distinct from unrun agent-skill scenarios."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from sourcekit_lib.assessment import assess, extract_links
from sourcekit_lib.common import SourceError, digest
import sourcekit

URL='https://example.com/docs/page'
GATE=b'<title>What</title><h1>Access Code Required</h1><p>A valid access code must be set to view the requested source.</p>'
ARTICLE=b'<title>API guide</title><main><h1>API guide</h1><p>Stable pagination uses a cursor. This article explains login errors and how to test access code required responses.</p></main>'
class AssessmentTests(unittest.TestCase):
    def test_http_200_gate_is_not_expected_content(self):
        r=assess(GATE,'html',['requested source'])
        self.assertEqual(r['state'],'authentication-required');self.assertTrue(r['criteriaMatched'])
    def test_gate_words_in_article_do_not_trigger(self):
        self.assertEqual(assess(ARTICLE,'html',['Stable pagination'])['state'],'expected-content')
    def test_no_contract_is_unknown(self):self.assertEqual(assess(ARTICLE,'html')['state'],'unknown')
    def test_unmatched_contract_is_unknown(self):self.assertEqual(assess(ARTICLE,'html',['missing concept'])['state'],'unknown')
    def test_all_markers_and_exact_title_required(self):
        for markers,title in [(['Stable pagination','absent'],None),(['Stable pagination'],'Guide')]:
            self.assertEqual(assess(ARTICLE,'html',markers,title)['state'],'unknown')
        self.assertEqual(assess(ARTICLE,'html',['stable   pagination'],'API guide')['state'],'expected-content')
    def test_not_regex(self):self.assertFalse(assess(ARTICLE,'html',['.*'])['criteriaMatched'])
    def test_title_only_contract_and_text_capture(self):
        self.assertEqual(assess(ARTICLE,'html',expected_title='API guide')['state'],'expected-content')
        self.assertEqual(assess(b'Observed local text','text',['local text'])['state'],'expected-content')
        self.assertEqual(assess(b'Observed local text','text',expected_title='local text')['state'],'unknown')
    def test_script_template_and_hidden_text_cannot_satisfy_marker(self):
        for part in ['<script>secret marker</script>','<template>secret marker</template>','<p hidden>secret marker</p>','<div aria-hidden="true">secret marker</div>']:
            self.assertFalse(assess(ARTICLE+part.encode(),'html',['secret marker'])['criteriaMatched'])
    def test_auth_control_is_not_an_article_login_form(self):
        login=b'<h1>Sign in</h1><form><input type="password"></form><p>Account access</p>'
        self.assertEqual(assess(login,'html')['state'],'authentication-required')
        self.assertEqual(assess(ARTICLE+b'<form><input type="password"></form>','html',['pagination'])['state'],'expected-content')
    def test_consent_interstitial_not_cookie_footer(self):
        self.assertEqual(assess(b'<h1>Before you continue</h1><button>Accept all</button>','html')['state'],'consent-interstitial')
        self.assertEqual(assess(ARTICLE+b'<footer>cookie consent <button>Accept all</button></footer>','html',['pagination'])['state'],'expected-content')
    def test_challenge_structure(self):
        r=assess(b'<title>Just a moment...</title><div id="cf-chl-widget">Verify your browser</div>','html')
        self.assertEqual(r['state'],'access-challenge')
    def test_javascript_shell_and_real_static_article(self):
        shell=b'<script src="/app.js"></script><noscript>Please enable JavaScript</noscript><div id="root"></div>'
        self.assertEqual(assess(shell,'html')['state'],'partial-js-required')
        self.assertEqual(assess(ARTICLE+shell,'html',['pagination'])['state'],'expected-content')
    def test_unknown_foreign_gate_is_not_mislabeled_healthy(self):
        self.assertEqual(assess('<h1>Accès requis</h1>'.encode(),'html')['state'],'unknown')
    def test_hash_binds_input_and_contract(self):
        a=assess(ARTICLE,'html',['pagination']);b=assess(ARTICLE,'html',['cursor'])
        self.assertEqual(a['inputSha256'],digest(ARTICLE));self.assertNotEqual(a['expectationsSha256'],b['expectationsSha256'])
    def test_invalid_inputs(self):
        for args in [([],None),([' '],None),(['x'*201],None),(['x']*11,None)]:
            if args==([],None):continue
            with self.assertRaises(SourceError):assess(ARTICLE,'html',*args)
        with self.assertRaises(SourceError):assess(ARTICLE,'feed')
    def test_excessive_markup_depth_and_nodes_fail(self):
        for raw in [b'<div>'*257,b'<br>'*20001]:
            with self.assertRaises(SourceError):assess(raw,'html')
    def test_bare_attributes_and_hidden_title_do_not_crash_or_match(self):
        r=assess(b'<p aria-hidden>Visible</p><input type><template><title>Fake</title></template>','html',expected_title='Fake')
        self.assertFalse(r['criteriaMatched'])
    def test_no_network_or_process_calls(self):
        with patch('socket.getaddrinfo',side_effect=AssertionError('network')),patch('subprocess.Popen',side_effect=AssertionError('process')):
            assess(ARTICLE,'html');extract_links(b'<a href="https://example.com/x">X</a>',URL)

class LinksTests(unittest.TestCase):
    def test_relative_and_deduplicated_links(self):
        r=extract_links(b'<a href="next">Next</a><a href="next#section">Again</a>',URL)
        self.assertEqual(r['items'],[{'url':'https://example.com/docs/next','label':'Next'}])
    def test_unsafe_links_omitted_without_echo(self):
        r=extract_links(b'<a href="javascript:alert(1)">script</a><a href="https://example.com/?token=secret">secret</a><a href="http://example.com/news">news</a>',URL)
        self.assertEqual(r['rejected'],2);self.assertNotIn('secret',json.dumps(r));self.assertEqual(len(r['items']),1)
    def test_base_is_not_authority(self):
        r=extract_links(b'<base href="https://other.example/"><a href="next">Next</a>',URL)
        self.assertEqual(r['items'][0]['url'],'https://example.com/docs/next')
    def test_hidden_links_and_nested_label(self):
        r=extract_links(b'<a hidden href="/hide">hidden</a><a href="/ok"><b>Useful</b> docs</a>',URL)
        self.assertEqual(r['items'],[{'url':'https://example.com/ok','label':'Useful docs'}])
    def test_limits_are_explicit(self):
        r=extract_links(b'<a href="/1">1</a><a href="/2">2</a>',URL,limit=1)
        self.assertEqual(r['omitted'],1);self.assertFalse(r['complete'])
        with self.assertRaises(SourceError):extract_links(ARTICLE,URL,limit=0)

class CLITests(unittest.TestCase):
    def invoke(self,raw,command='parse',*extra):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'capture.html';path.write_bytes(raw)
            args=[sys.executable,str(ROOT/'tools/sourcekit.py'),command,str(path),'--format','html']
            if command=='parse':args+=['--source-url',URL]
            return subprocess.run(args+list(extra),capture_output=True,text=True,timeout=10)
    def test_assess_is_separate_from_legacy_capture(self):
        r=self.invoke(GATE,'assess');self.assertEqual(r.returncode,0);self.assertEqual(json.loads(r.stdout)['state'],'authentication-required')
        r=self.invoke(GATE);p=json.loads(r.stdout)
        self.assertEqual(p['status'],'ok');self.assertEqual(p['contentAssessment']['state'],'authentication-required')
        self.assertEqual(p['evidence']['contentSha256'],digest(p['content']))
    def test_require_content_preserves_evidence_and_exit3(self):
        r=self.invoke(GATE,'parse','--expect-text','requested source','--require-content')
        self.assertEqual(r.returncode,3);self.assertEqual(json.loads(r.stdout)['status'],'ok')
    def test_matching_expectations_pass(self):
        r=self.invoke(ARTICLE,'parse','--expect-text','pagination','--require-content')
        self.assertEqual(r.returncode,0);self.assertEqual(json.loads(r.stdout)['contentAssessment']['state'],'expected-content')
    def test_require_without_expectation_blocks_before_network(self):
        with patch('sourcekit.fetch_public',side_effect=AssertionError('network')):
            self.assertEqual(sourcekit.main(['read',URL,'--allow-host','example.com','--require-content']),2)
    def test_include_links_opt_in(self):
        raw=ARTICLE+b'<a href="/reference">Reference</a>'
        self.assertNotIn('links',json.loads(self.invoke(raw).stdout)['content'])
        self.assertEqual(len(json.loads(self.invoke(raw,'parse','--include-links').stdout)['content']['links']['items']),1)
    def test_feed_flags_rejected_before_network(self):
        with patch('sourcekit.fetch_public',side_effect=AssertionError('network')):
            self.assertEqual(sourcekit.main(['read',URL,'--allow-host','example.com','--format','feed','--expect-text','x']),2)

if __name__=='__main__':unittest.main()
