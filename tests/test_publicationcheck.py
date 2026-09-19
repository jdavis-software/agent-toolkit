"""Original independent fixtures. No external requests or paid services."""
import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
sys.dont_write_bytecode = True
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from publication_lib.common import Invalid, read_bytes, parse_json
from publication_lib import records
from publication_lib.site import audit_site
from publication_lib.media import inspect_media


def example(name):
    return json.loads((ROOT / f'examples/publicationcheck/{name}.json').read_text())


def codes(result):
    return {f['code'] for f in result['findings']}


class RecordChecks(unittest.TestCase):
    def test_all_four_records_pass(self):
        for kind in ('research', 'debt', 'storyboard', 'explanation'):
            self.assertEqual(getattr(records, kind)(example(kind), ROOT)['status'], 'checks-passed')

    def test_republication_is_not_a_new_event(self):
        result = records.research(example('research'), ROOT)
        self.assertEqual([e['classification'] for e in result['events']], ['outside-window', 'in-window'])

    def test_repeated_coverage_counts_one_declared_event(self):
        doc = example('research'); c = copy.deepcopy(doc['claims'][1]); c['id'] = 'echo'; doc['claims'].append(c)
        result = records.research(doc, ROOT)
        self.assertEqual(len(result['events']), 2)
        self.assertEqual(result['events'][1]['declaredIndependentGroups'], 1)

    def test_half_open_boundaries(self):
        doc = example('research'); doc['claims'][0]['eventAt'] = doc['window']['start']; doc['claims'][1]['eventAt'] = doc['window']['end']
        self.assertEqual([e['classification'] for e in records.research(doc, ROOT)['events']], ['in-window', 'outside-window'])

    def test_unknown_date_not_replaced_with_publication(self):
        doc = example('research'); doc['claims'][0]['eventAt'] = None
        self.assertIn('unknown-event-date', codes(records.research(doc, ROOT)))

    def test_future_event_is_flagged(self):
        doc = example('research'); doc['claims'][0]['eventAt'] = '2027-01-01T00:00:00Z'
        self.assertIn('future-event', codes(records.research(doc, ROOT)))

    def test_coverage_missing_remains_visible(self):
        doc = example('research'); doc['coverage'][0]['status'] = 'blocked'
        self.assertIn('source-coverage-gap', codes(records.research(doc, ROOT)))

    def test_quote_match_is_required_not_claimed_truth(self):
        doc = example('research'); doc['claims'][0]['citations'][0]['quote'] = 'This claim does not exist.'
        result = records.research(doc, ROOT)
        self.assertIn('quote-not-in-capture', codes(result))
        self.assertEqual(result['semanticSupport'], 'caller-assessed-not-authenticated')

    def test_capture_digest_drift_is_not_a_pass(self):
        doc = example('research'); doc['evidence'][0]['sha256'] = '0' * 64
        self.assertIn('evidence-changed', codes(records.research(doc, ROOT)))

    def test_contradiction_remains_nonpassing(self):
        doc = example('research'); doc['claims'][1]['assessment'] = 'contradicted'
        self.assertIn('claim-needs-review', codes(records.research(doc, ROOT)))

    def test_duplicate_claim_rejected(self):
        doc = example('research'); doc['claims'].append(copy.deepcopy(doc['claims'][0]))
        with self.assertRaises(Invalid): records.research(doc, ROOT)

    def test_inconsistent_event_dates_rejected(self):
        doc = example('research'); doc['claims'][1]['eventId'] = doc['claims'][0]['eventId']
        with self.assertRaises(Invalid): records.research(doc, ROOT)

    def test_timezone_required(self):
        doc = example('research'); doc['window']['start'] = '2026-08-01T00:00:00'
        with self.assertRaises(Invalid): records.research(doc, ROOT)

    def test_future_observation_rejected(self):
        doc = example('research'); doc['sources'][0]['observedAt'] = '2027-01-01T00:00:00Z'
        with self.assertRaises(Invalid): records.research(doc, ROOT)

    def test_debt_does_not_rank_generated_size_as_defect(self):
        result = records.debt(example('debt'), ROOT)
        self.assertEqual([r['actionCandidate'] for r in result['findingsReview']], [True, False])

    def test_unrun_reproduction_is_not_confirmed(self):
        doc = example('debt'); doc['findings'][0]['check']['status'] = 'not-run'
        self.assertIn('unconfirmed-defect', codes(records.debt(doc, ROOT)))

    def test_debt_missing_evidence_is_not_confirmed(self):
        doc = example('debt'); doc['findings'][0]['citations'] = []
        self.assertIn('missing-finding-evidence', codes(records.debt(doc, ROOT)))

    def test_timeline_gap_and_overlap(self):
        for start in (149, 151):
            doc = example('storyboard'); doc['shots'][1]['startFrame'] = start
            self.assertIn('timeline-gap-or-overlap', codes(records.storyboard(doc, ROOT)))

    def test_short_timeline_flagged(self):
        doc = example('storyboard'); doc['shots'] = doc['shots'][:2]
        self.assertIn('timeline-incomplete', codes(records.storyboard(doc, ROOT)))

    def test_planned_feature_cannot_be_live(self):
        doc = example('storyboard'); doc['shots'][2]['presentedAs'] = 'available'
        self.assertIn('unavailable-feature-presented-live', codes(records.storyboard(doc, ROOT)))

    def test_unknown_rights_prevent_passing(self):
        doc = example('storyboard'); doc['assets'][0]['usage'] = 'unknown'
        self.assertIn('asset-not-approved', codes(records.storyboard(doc, ROOT)))

    def test_caption_overlap_flagged(self):
        doc = example('storyboard'); doc['captions'][1]['startFrame'] = 149
        self.assertIn('invalid-caption-timing', codes(records.storyboard(doc, ROOT)))

    def test_missing_asset_is_not_substituted(self):
        doc = example('storyboard'); doc['shots'][0]['assetIds'] = ['missing']
        with self.assertRaises(Invalid): records.storyboard(doc, ROOT)

    def test_boolean_frame_rate_is_not_integer(self):
        doc = example('storyboard'); doc['fps'] = True
        with self.assertRaises(Invalid): records.storyboard(doc, ROOT)

    def test_assumed_edge_explicit_not_validated_truth(self):
        doc = example('explanation'); doc['edges'][0]['status'] = 'assumption'
        self.assertIn('assumed-connection', codes(records.explanation(doc, ROOT)))

    def test_unsupported_edge_flagged(self):
        doc = example('explanation'); doc['edges'][0]['citations'] = []
        self.assertIn('unsupported-connection', codes(records.explanation(doc, ROOT)))

    def test_dangling_edge_rejected(self):
        doc = example('explanation'); doc['edges'][0]['to'] = 'nonexistent'
        with self.assertRaises(Invalid): records.explanation(doc, ROOT)

    def test_no_input_document_mutation(self):
        doc = example('research'); original = copy.deepcopy(doc)
        self.assertEqual(records.research(doc, ROOT), records.research(doc, ROOT)); self.assertEqual(doc, original)

    def test_unknown_authority_field_rejected(self):
        doc = example('research'); doc['authorizePublication'] = True
        with self.assertRaises(Invalid): records.research(doc, ROOT)


class FileChecks(unittest.TestCase):
    def test_duplicate_json_and_nonfinite_rejected(self):
        for b in (b'{"x":1,"x":2}', b'{"x":NaN}', b'{"x":Infinity}'):
            with self.assertRaises(Invalid): parse_json(b)

    def test_deep_json_rejected(self):
        with self.assertRaises(Invalid): parse_json(('['*26+'0'+']'*26).encode())

    def test_oversized_input_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); (p/'big').write_bytes(b'0' * 100)
            with self.assertRaises(Invalid): read_bytes(p, 'big', 10)

    def test_symlink_file_and_directory_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); (p/'real').write_text('x'); (p/'link').symlink_to(p/'real'); (p/'dir').symlink_to(p, target_is_directory=True)
            for name in ('link', 'dir/real'):
                with self.assertRaises(Invalid): read_bytes(p, name)

    def test_fifo_is_rejected_before_opening(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); os.mkfifo(p/'pipe')
            with self.assertRaises(Invalid): read_bytes(p, 'pipe')

    def test_cli_reports_findings_with_exit_three(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d)/'input.json'; doc = example('research'); doc['claims'][0]['eventAt'] = None; p.write_text(json.dumps(doc))
            result = subprocess.run([sys.executable, str(ROOT/'tools/publicationcheck.py'), 'research', str(p), '--root', str(ROOT)], capture_output=True, text=True)
            self.assertEqual(result.returncode, 3); self.assertEqual(json.loads(result.stdout)['status'], 'needs-review')

    def test_cli_errors_do_not_echo_private_path_or_content(self):
        result = subprocess.run([sys.executable, str(ROOT/'tools/publicationcheck.py'), 'research', '/missing/SECRET_TOKEN', '--root', str(ROOT)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2); self.assertNotIn('SECRET_TOKEN', result.stdout + result.stderr)

    def test_default_records_have_no_network_or_subprocess_effects(self):
        with patch('socket.socket', side_effect=AssertionError('network')), patch('subprocess.Popen', side_effect=AssertionError('process')):
            self.assertEqual(records.research(example('research'), ROOT)['status'], 'checks-passed')


BASE = 'https://example.test/toolkit/'
HTML = '<html><head><title>Readable page</title><meta name="description" content="A fixture."><link rel="canonical" href="'+BASE+'"></head><body><h1 id="main">Hello</h1><a href="#main">Skip</a></body></html>'
SITEMAP = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+BASE+'</loc></url></urlset>'

class SiteChecks(unittest.TestCase):
    def run_site(self, html=HTML, sitemap=SITEMAP):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); (root/'index.html').write_text(html); (root/'sitemap.xml').write_text(sitemap)
            (root/'404.html').write_text('Not an indexable page')
            return audit_site(root, BASE)

    def test_valid_page_matches_contract(self):
        self.assertEqual(self.run_site()['status'], 'checks-passed')

    def test_noindex(self):
        self.assertIn('indexing-disabled', codes(self.run_site(HTML.replace('</head>', '<meta name="robots" content="noindex"></head>'))))

    def test_wrong_canonical(self):
        self.assertIn('canonical-mismatch', codes(self.run_site(HTML.replace(BASE, 'https://wrong.test/'))))

    def test_missing_description(self):
        self.assertIn('missing-or-duplicate-description', codes(self.run_site(HTML.replace('name="description"','name="other"'))))

    def test_missing_title(self):
        self.assertIn('missing-title', codes(self.run_site(HTML.replace('<title>Readable page</title>', ''))))

    def test_missing_link(self):
        self.assertIn('broken-internal-link', codes(self.run_site(HTML.replace('#main', 'missing/'))))

    def test_wrong_project_base(self):
        self.assertIn('internal-link-wrong-base', codes(self.run_site(HTML.replace('#main', '/skills/example/'))))

    def test_missing_fragment(self):
        self.assertIn('missing-fragment', codes(self.run_site(HTML.replace('href="#main"','href="#unknown"'))))

    def test_sitemap_mismatch(self):
        self.assertIn('sitemap-page-mismatch', codes(self.run_site(sitemap=SITEMAP.replace(BASE, BASE+'missing/'))))

    def test_duplicate_sitemap_entry(self):
        self.assertIn('duplicate-sitemap-url', codes(self.run_site(sitemap=SITEMAP.replace('</urlset>', '<url><loc>'+BASE+'</loc></url></urlset>'))))

    def test_external_links_are_not_fetched(self):
        with patch('socket.socket', side_effect=AssertionError('network')):
            self.assertEqual(self.run_site(HTML.replace('#main', 'https://external.test/'))['status'], 'checks-passed')

    def test_jsonld_syntax_only(self):
        html = HTML.replace('</head>', '<script type="application/ld+json">{broken}</script></head>')
        self.assertIn('invalid-jsonld', codes(self.run_site(html)))

    def test_xml_entities_rejected(self):
        with self.assertRaises(Invalid): self.run_site(sitemap='<!DOCTYPE x [<!ENTITY a SYSTEM "file:///etc/passwd">]>'+SITEMAP)

    def test_site_symlink_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); (root/'index.html').symlink_to(ROOT/'README.md')
            with self.assertRaises(Invalid): audit_site(root, BASE)


class MediaChecks(unittest.TestCase):
    def run_probe(self, change=None, spec_change=None):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); (root/'input.mp4').write_bytes(b'synthetic-container')
            probe = {'streams':[{'codec_type':'video','width':320,'height':180,'avg_frame_rate':'30/1','sample_aspect_ratio':'1:1'}, {'codec_type':'audio'}], 'format':{'duration':'2'}}
            if change: change(probe)
            spec = example('media'); spec.update(spec_change or {})
            def fake(argv, **kwargs): return json.dumps(probe).encode() if argv[0] == 'ffprobe' else b''
            with patch('publication_lib.media.command', side_effect=fake):
                return inspect_media(root, 'input.mp4', spec)

    def test_expected_metadata_and_decode(self):
        result = self.run_probe(); self.assertEqual(result['status'],'checks-passed'); self.assertTrue(result['decoded'])

    def test_zero_exit_wrong_duration_fails(self):
        self.assertIn('duration-mismatch', codes(self.run_probe(spec_change={'durationSeconds':3})))

    def test_missing_audio_fails(self):
        self.assertIn('missing-audio', codes(self.run_probe(lambda p:p['streams'].pop())))

    def test_dimensions_fps_rotation_checked(self):
        def change(p): p['streams'][0].update(width=321,avg_frame_rate='24/1',side_data_list=[{'rotation':90}])
        self.assertTrue({'dimension-mismatch','frame-rate-mismatch','rotation-needs-review'} <= codes(self.run_probe(change)))

    def test_no_unknown_duration_pass(self):
        self.assertIn('unknown-or-excessive-duration',codes(self.run_probe(lambda p:p['format'].clear())))

    def test_unapproved_container_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); (p/'input.m3u8').write_text('https://private.invalid/')
            with self.assertRaises(Invalid): inspect_media(p,'input.m3u8',example('media'))

    def test_probe_failure_cannot_be_pass(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d); (p/'input.mp4').write_bytes(b'x')
            with patch('publication_lib.media.command',side_effect=Invalid('failed')):
                with self.assertRaises(Invalid): inspect_media(p,'input.mp4',example('media'))

for unsafe in ['../outside','/absolute','a//b','a/./b','a/../b','.git/config','C:\\secret']:
    def check(self, value=unsafe):
        with self.assertRaises(Invalid): read_bytes(ROOT, value)
    setattr(FileChecks, 'test_path_'+str(len(FileChecks.__dict__)), check)

if __name__ == '__main__': unittest.main()
