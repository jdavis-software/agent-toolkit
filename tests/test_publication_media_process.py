"""Process-boundary tests using our own Python child, not installed media binaries."""
from pathlib import Path
import os
import sys
import unittest
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
from publication_lib.common import Invalid
from publication_lib.media import command


class ProcessBoundaryTests(unittest.TestCase):
    def test_actual_child_returns_stdout_only(self):
        self.assertEqual(command([sys.executable, '-c', 'import sys; print("ok"); print("diagnostic",file=sys.stderr)']), b'ok\n')

    def test_nonzero_child_cannot_pass_or_echo_its_output(self):
        with self.assertRaisesRegex(Invalid, '^Media probe or decode failed$'):
            command([sys.executable, '-c', 'import sys; print("PRIVATE"); sys.exit(2)'])

    def test_open_pipe_child_times_out(self):
        with self.assertRaisesRegex(Invalid, '^Media command timed out$'):
            command([sys.executable, '-c', 'import time; time.sleep(30)'], timeout=.2)

    def test_closed_pipe_child_still_has_deadline(self):
        with self.assertRaisesRegex(Invalid, '^Media command timed out$'):
            command([sys.executable, '-c', 'import os,time; os.close(1); os.close(2); time.sleep(30)'], timeout=.2)

    def test_aggregate_output_is_bounded(self):
        with self.assertRaisesRegex(Invalid, '^Media command output exceeds limit$'):
            command([sys.executable, '-c', 'import sys; sys.stdout.buffer.write(b"x" * (1024 * 1024 + 1))'])


if __name__ == '__main__':
    unittest.main()
