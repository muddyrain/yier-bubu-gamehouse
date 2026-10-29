"""P1-03 bounded pure TypeScript behavior and view source contracts, never a Cocos substitute."""
from __future__ import annotations

import shutil
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class CharacterSelectionTests(unittest.TestCase):
    def test_character_selection_behavior_and_view_contracts(self) -> None:
        node = shutil.which('node')
        self.assertIsNotNone(node, 'Requires existing Node; no install or GUI fallback')
        self.assertTrue((ROOT / 'node_modules/typescript/lib/typescript.js').is_file(), 'Requires locked TypeScript')
        result = subprocess.run([node, str(ROOT / 'tools/tests/character_selection.test.cjs')], cwd=ROOT,
                                capture_output=True, timeout=10, shell=False)
        print(result.stdout.decode('utf-8', errors='replace'), end='')
        self.assertEqual(result.returncode, 0, result.stderr.decode('utf-8', errors='replace'))
        self.assertIn(b'13 checks passed', result.stdout)


if __name__ == '__main__':
    unittest.main()
