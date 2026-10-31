"""Bounded tests of real engine-free lifecycle/session/counter rules; never imports Cocos."""
from pathlib import Path
import shutil
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[2]


class GameLifecycleTests(unittest.TestCase):
    def test_real_session_lifecycle_and_counter_rules(self):
        node = shutil.which('node')
        self.assertIsNotNone(node, 'Requires existing Node; no install or GUI fallback')
        self.assertTrue((ROOT / 'node_modules/typescript/lib/typescript.js').is_file(), 'Requires locked TypeScript')
        result = subprocess.run([node, str(ROOT / 'tools/tests/game_lifecycle.test.cjs')], cwd=ROOT,
                                capture_output=True, timeout=10, shell=False)
        print(result.stdout.decode('utf-8', errors='replace'), end='')
        self.assertEqual(result.returncode, 0, result.stderr.decode('utf-8', errors='replace'))
        self.assertIn(b'Game lifecycle: 23 checks passed.', result.stdout)


if __name__ == '__main__':
    unittest.main()
