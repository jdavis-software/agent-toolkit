import copy
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from publication_lib.common import Invalid
from publication_lib.index_review import index_review
from publication_lib.timeline import timeline
from publication_lib.datasets import dataset, experiment
class Specialists(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
        for p in (ROOT/'examples/specialist-collection').iterdir():
            if p.is_file():shutil.copyfile(p,self.root/p.name)
        self.index=json.loads((self.root/'index.json').read_text());self.timeline=json.loads((self.root/'timeline.json').read_text());self.data=json.loads((self.root/'dataset.json').read_text())
    def codes(self,r):return [f['code'] for f in r['findings']]
    def csv(self,s):
        (self.root/'runs.csv').write_text(s);self.data['sha256']=hashlib.sha256((self.root/'runs.csv').read_bytes()).hexdigest()
    def current(self):return (self.root/'runs.csv').read_text()
    def test_index_good(self):self.assertEqual(index_review(self.index,self.root)['status'],'checks-passed')
    def test_index_changed_source(self):
        (self.root/'worker.go').write_text('changed');self.assertIn('source-bytes-changed',self.codes(index_review(self.index,self.root)))
    def test_index_wrong_root(self):
        self.index['observedRoot']='another';self.assertIn('wrong-index-view',self.codes(index_review(self.index,self.root)))
    def test_index_freshness(self):
        for state in ['stale','unavailable','unknown']:
            self.index['freshness']=state;self.assertIn('index-not-fresh',self.codes(index_review(self.index,self.root)))
    def test_index_partial_coverage(self):
        self.index['coverage']='partial';self.assertIn('probe-coverage-unestablished',self.codes(index_review(self.index,self.root)))
    def test_index_wrong_answer(self):
        self.index['probes'][0]['actual']=['Different'];self.assertIn('probe-answer-mismatch',self.codes(index_review(self.index,self.root)))
    def test_index_unrun_probe(self):
        self.index['probes'][0]['status']='not-run';self.assertIn('probe-not-completed',self.codes(index_review(self.index,self.root)))
    def test_index_duplicate_probe(self):
        self.index['probes'].append(copy.deepcopy(self.index['probes'][0]));self.assertRaises(Invalid,index_review,self.index,self.root)
    def test_index_unknown_scope(self):
        self.index['probes'][0]['sourceIds']=['missing'];self.assertRaises(Invalid,index_review,self.index,self.root)
    def test_index_duplicate_answers(self):
        self.index['probes'][0]['actual']=['Run','Run'];self.assertRaises(Invalid,index_review,self.index,self.root)
    def test_index_missing_file(self):
        (self.root/'worker.go').unlink();self.assertRaises(OSError,index_review,self.index,self.root)
    def test_index_symlink(self):
        (self.root/'worker.go').unlink();(self.root/'worker.go').symlink_to(self.root/'request.ts');self.assertRaises(Invalid,index_review,self.index,self.root)
    def test_index_traversal(self):
        self.index['files'][0]['path']='../outside';self.assertRaises(Invalid,index_review,self.index,self.root)
    def test_index_extra_fields(self):
        self.index['shell']='no';self.assertRaises(Invalid,index_review,self.index,self.root)
    def test_timeline_good(self):
        r=timeline(self.timeline,self.root);self.assertEqual(r['status'],'checks-passed');self.assertEqual(r['durationSeconds'],2)
    def test_timeline_narration_change(self):
        (self.root/'narration.txt').write_text('new');self.assertIn('dependency-bytes-changed',self.codes(timeline(self.timeline,self.root)))
    def test_timeline_gap(self):
        self.timeline['clips'][1]['start']=31;self.assertIn('primary-gap-or-overlap',self.codes(timeline(self.timeline,self.root)))
    def test_timeline_overlap(self):
        self.timeline['clips'][1]['start']=29;self.assertIn('primary-gap-or-overlap',self.codes(timeline(self.timeline,self.root)))
    def test_timeline_missing_tail(self):
        self.timeline['clips'][1]['end']=59;self.assertIn('primary-incomplete',self.codes(timeline(self.timeline,self.root)))
    def test_timeline_duplicate_asset(self):
        self.timeline['assets'].append(copy.deepcopy(self.timeline['assets'][0]));self.assertRaises(Invalid,timeline,self.timeline,self.root)
    def test_timeline_duplicate_clip(self):
        self.timeline['clips'].append(copy.deepcopy(self.timeline['clips'][0]));self.assertRaises(Invalid,timeline,self.timeline,self.root)
    def test_timeline_unknown_asset(self):
        self.timeline['clips'][0]['assetId']='missing';self.assertRaises(Invalid,timeline,self.timeline,self.root)
    def test_timeline_zero_duration(self):
        self.timeline['clips'][1]['end']=30;self.assertRaises(Invalid,timeline,self.timeline,self.root)
    def test_timeline_invalid_rate(self):
        for n,d in [(0,1),(30,0),(121,1),(True,1)]:
            self.timeline['fps']={'numerator':n,'denominator':d};self.assertRaises(Invalid,timeline,self.timeline,self.root)
    def test_timeline_source_bounds(self):
        self.timeline['assets'][0]['kind']='video';self.timeline['assets'][0]['frames']=20;self.assertIn('source-trim-overrun',self.codes(timeline(self.timeline,self.root)))
    def test_timeline_audio_on_visual(self):
        self.timeline['assets'][0].update(kind='audio',frames=30);self.assertIn('track-type-mismatch',self.codes(timeline(self.timeline,self.root)))
    def test_timeline_unordered_input_can_still_cover(self):
        self.timeline['clips'].reverse();self.assertEqual(timeline(self.timeline,self.root)['status'],'checks-passed')
    def test_timeline_fractional_frame_rejected(self):
        self.timeline['clips'][0]['end']=29.5;self.assertRaises(Invalid,timeline,self.timeline,self.root)
    def test_dataset_scope_and_unknowns(self):
        r=dataset(self.data,self.root);self.assertEqual(r['rows'],7);self.assertEqual(r['unknownCells']['output_tokens'],1);self.assertIsNone(r['taskResults'][-1]['outputTokens'])
    def test_descriptive_pairs_hand_calculation(self):
        r=experiment(self.data,self.root);c=r['comparison'];self.assertEqual(c['candidateMinusBaselineAttemptMs'],[-4,-12]);self.assertEqual(c['meanDifferenceMs'],-8);self.assertEqual(c['medianDifferenceMs'],-8);self.assertEqual(c['pairedTasks'],2);self.assertEqual(c['excludedTimingTasks'],['c']);self.assertEqual(c['outcomes']['candidate'],{'accepted':2,'tasks':3});self.assertEqual(r['inference'],'not-performed')
    def test_retry_work_not_discarded(self):
        r=dataset(self.data,self.root);b=next(r for r in r['taskResults'] if r['task']=='b' and r['condition']=='baseline');self.assertEqual(b['attemptExecutionMs'],20);self.assertEqual(b['inputTokens'],27)
    def test_missing_workload_rejects_comparison(self):
        self.csv('\n'.join(x for x in self.current().splitlines() if not x.startswith('c,candidate'))+'\n');r=experiment(self.data,self.root);self.assertIn('missing-task-condition',self.codes(r));self.assertIsNone(r['comparison'])
    def test_duplicate_attempt_visible(self):
        self.csv(self.current()+'a,baseline,1,accepted,10,20,5\n');self.assertIn('duplicate-attempt',self.codes(dataset(self.data,self.root)))
    def test_attempt_gap_visible(self):
        self.csv(self.current().replace('b,baseline,2','b,baseline,3'));self.assertIn('noncontiguous-attempts',self.codes(dataset(self.data,self.root)))
    def test_attempt_after_acceptance(self):
        self.csv(self.current()+'a,baseline,2,accepted,1,1,1\n');self.assertIn('attempt-after-terminal-or-incomplete',self.codes(dataset(self.data,self.root)))
    def test_unknown_duration_not_zero(self):
        self.csv(self.current().replace('a,candidate,1,accepted,6,','a,candidate,1,accepted,,'));r=experiment(self.data,self.root);self.assertEqual(r['comparison']['pairedTasks'],1);self.assertEqual(r['comparison']['meanDifferenceMs'],-12)
    def test_no_accepted_pairs(self):
        self.csv(self.current().replace(',candidate,1,accepted,',',candidate,1,failed,'));self.assertIsNone(experiment(self.data,self.root)['comparison']['meanDifferenceMs'])
    def test_mismatched_file_hash(self):
        (self.root/'runs.csv').write_text('other');self.assertRaises(Invalid,dataset,self.data,self.root)
    def test_header_unit_rejected(self):
        self.csv(self.current().replace('duration_ms','duration_s'));self.assertRaises(Invalid,dataset,self.data,self.root)
    def test_manifest_unit_rejected(self):
        self.data['durationUnit']='s';self.assertRaises(Invalid,dataset,self.data,self.root)
    def test_numeric_cells_not_code_or_nan(self):
        source=self.current()
        for value in ['NaN','Infinity','-1','=1+1','1 ms','1e3']:
            self.csv(source.replace(',accepted,10,',f',accepted,{value},'));self.assertRaises(Invalid,dataset,self.data,self.root)
    def test_outside_declared_workload(self):
        self.csv(self.current().replace('a,baseline','z,baseline'));self.assertRaises(Invalid,dataset,self.data,self.root)
    def test_fractional_tokens_rejected(self):
        self.csv(self.current().replace(',10,20,5',',10,20.5,5'));self.assertRaises(Invalid,dataset,self.data,self.root)
    def test_versions_are_exact_integers(self):
        for doc,fn in [(self.index,index_review),(self.timeline,timeline),(self.data,dataset)]:
            for value in [True,1.0,'1',2]:
                d=copy.deepcopy(doc);d['schemaVersion']=value;self.assertRaises(Invalid,fn,d,self.root)
    def test_preserves_source_bytes(self):
        before={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in self.root.iterdir() if p.is_file()};experiment(self.data,self.root);timeline(self.timeline,self.root);index_review(self.index,self.root);after={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in self.root.iterdir() if p.is_file()};self.assertEqual(before,after)
    def test_cli_success_and_mismatch_exit_codes(self):
        cmd=[sys.executable,str(ROOT/'tools/publicationcheck.py'),'index',str(self.root/'index.json'),'--root',str(self.root)]
        r=subprocess.run(cmd,capture_output=True,text=True);self.assertEqual(r.returncode,0,r.stdout)
        (self.root/'worker.go').write_text('changed');r=subprocess.run(cmd,capture_output=True,text=True);self.assertEqual(r.returncode,3);self.assertNotIn(str(self.root),r.stdout)
    def test_demo_checks_actual_local_drift(self):
        r=subprocess.run([sys.executable,str(ROOT/'examples/specialist-collection/demo.py')],capture_output=True,text=True);self.assertEqual(r.returncode,0,r.stderr);d=json.loads(r.stdout);self.assertTrue(d['indexDriftDetected']);self.assertTrue(d['narrationRevisionDetected'])
if __name__=='__main__':unittest.main()
