"""Pure CLI regression tests; no editor, browser, network, or engine imports."""
from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

TOOLS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TOOLS))

import validate
import check_docs


class ValidationTests(unittest.TestCase):
    def test_commands_are_fixed_cli_checks(self) -> None:
        checks = validate.checks(TOOLS.parent)
        self.assertEqual(set(checks), {'docs', 'unit', 'typecheck'})
        self.assertEqual(checks['docs'].command[0], sys.executable)
        self.assertEqual(checks['unit'].command[0], sys.executable)
        self.assertIn('--noEmit', checks['typecheck'].command)
        self.assertTrue(all(0 < check.timeout <= 60 for check in checks.values()))

    def test_failure_preserves_exit_code_and_output(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            check = validate.Check((sys.executable, '-c', "print('failure evidence'); raise SystemExit(7)"), 5)
            result = validate.run_check('failure', check, TOOLS.parent, Path(folder))
            self.assertEqual(result['status'], 'failed')
            self.assertEqual(result['exit_code'], 7)
            self.assertIn('failure evidence', Path(result['log']).read_text(encoding='utf-8'))

    def test_timeout_stops_owned_child(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            check = validate.Check((sys.executable, '-c', 'import time; time.sleep(10)'), 0.1)
            result = validate.run_check('timeout', check, TOOLS.parent, Path(folder))
            self.assertEqual(result['status'], 'failed')
            self.assertEqual(result['exit_code'], 124)
            self.assertIn('TIMEOUT', Path(result['log']).read_text(encoding='utf-8'))

    def test_missing_input_blocks_without_launching(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            missing = Path(folder) / 'missing-engine-types.json'
            check = validate.Check((sys.executable, '-c', 'raise SystemExit(99)'), 5, (missing,))
            result = validate.run_check('missing', check, TOOLS.parent, Path(folder))
            self.assertEqual(result['status'], 'blocked')
            self.assertEqual(result['exit_code'], 2)
            self.assertIn('missing-engine-types.json', Path(result['log']).read_text(encoding='utf-8'))

    def test_each_engine_declaration_is_required_before_typecheck(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            check = validate.checks(root)['typecheck']
            required_declarations = {
                root / 'client/temp/declarations' / f'{name}.d.ts'
                for name in ('cc', 'cc.env', 'cc.custom-macro', 'jsb')
            }
            self.assertTrue(required_declarations.issubset(set(check.required)))
            for path in check.required:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('', encoding='utf-8')
            for missing in required_declarations:
                with self.subTest(declaration=missing.name):
                    missing.unlink()
                    with patch('validate.subprocess.run') as launch:
                        result = validate.run_check('typecheck', check, root, root / 'logs')
                        self.assertEqual(result['status'], 'blocked')
                        self.assertEqual(result['exit_code'], 2)
                        launch.assert_not_called()
                    missing.write_text('', encoding='utf-8')

    def test_missing_executable_is_blocked(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            check = validate.Check((str(root / 'missing-cli-program'),), 1)
            result = validate.run_check('unavailable', check, root, root / 'logs')
            self.assertEqual(result['status'], 'blocked')
            self.assertEqual(result['exit_code'], 2)

    def test_document_scan_excludes_dependencies_and_local_evidence(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            for name in ('README.md', 'AGENTS.md', 'docs/PLAN.md', 'node_modules/pkg/README.md', '.local/note.md', 'client/temp/note.md'):
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('# Example\n', encoding='utf-8')
            self.assertEqual(
                {p.relative_to(root).as_posix() for p in check_docs.markdown_paths(root)},
                {'README.md', 'AGENTS.md', 'docs/PLAN.md'},
            )


if __name__ == '__main__':
    unittest.main()
