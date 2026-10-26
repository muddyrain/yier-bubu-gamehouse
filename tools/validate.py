#!/usr/bin/env python3
"""Bounded, sequential CLI checks. Never starts Cocos, a browser, or a GUI."""
from __future__ import annotations

import argparse
import json
import os
import platform
import shutil
import subprocess
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class Check:
    command: tuple[str, ...]
    timeout: float
    required: tuple[Path, ...] = ()


def checks(root: Path) -> dict[str, Check]:
    compiler = root / 'node_modules/typescript/lib/tsc.js'
    generated_config = root / 'client/temp/tsconfig.cocos.json'
    declarations = tuple(root / 'client/temp/declarations' / f'{name}.d.ts'
                         for name in ('cc', 'cc.env', 'cc.custom-macro', 'jsb'))
    return {
        'docs': Check((sys.executable, '-B', str(root / 'tools/check_docs.py')), 30),
        'unit': Check((sys.executable, '-B', '-m', 'unittest', 'discover', '-s', str(root / 'tools/tests'), '-v'), 30),
        'typecheck': Check(
            (shutil.which('node') or 'node', str(compiler), '--project', str(root / 'client/tsconfig.json'), '--noEmit'),
            60,
            (compiler, generated_config, *declarations),
        ),
    }


def run_check(name: str, check: Check, root: Path, log_dir: Path) -> dict:
    started = time.monotonic()
    log_path = log_dir / f'{name}.log'
    log_dir.mkdir(parents=True, exist_ok=True)
    status, code = 'blocked', 2
    with log_path.open('w', encoding='utf-8') as log:
        log.write(f'command: {json.dumps(check.command)}\ntimeout_seconds: {check.timeout}\n')
        missing = [str(path) for path in check.required if not path.is_file()]
        if missing:
            log.write('BLOCKED: missing prerequisites: ' + ', '.join(missing) + '\n')
            log.write('Use locked dependencies and genuine Cocos Creator 3.8.8 config/declarations. No GUI is started.\n')
            log.write('Do not open Cocos on macOS to fix this. Arrange permitted Windows generation separately.\n')
        else:
            log.flush()
            try:
                # All production commands above are audited CLI-only leaf processes.
                # subprocess.run kills and waits for its own child on timeout.
                completed = subprocess.run(
                    check.command, cwd=root, stdout=log, stderr=subprocess.STDOUT,
                    timeout=check.timeout, shell=False, check=False,
                    env={**os.environ, 'PYTHONIOENCODING': 'utf-8', 'PYTHONDONTWRITEBYTECODE': '1'},
                )
                code = completed.returncode
                status = 'passed' if code == 0 else 'failed'
            except subprocess.TimeoutExpired:
                status, code = 'failed', 124
                log.write(f'\nTIMEOUT: child killed and waited after {check.timeout}s.\n')
            except OSError as error:
                log.write(f'BLOCKED: {error}\n')
    return {
        'check': name, 'status': status, 'exit_code': code,
        'duration_seconds': round(time.monotonic() - started, 3), 'log': str(log_path),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('check', nargs='?', default='all', choices=['all', *checks(ROOT)])
    args = parser.parse_args()
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')
    log_dir = ROOT / '.local/validation/p1-01' / stamp
    selected = checks(ROOT)
    if args.check != 'all':
        selected = {args.check: selected[args.check]}
    results = [run_check(name, check, ROOT, log_dir) for name, check in selected.items()]
    summary = {'os': platform.system(), 'os_version': platform.version(), 'python': platform.python_version(), 'results': results}
    (log_dir / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
    for result in results:
        print(f"{result['check']}: {result['status']} (exit {result['exit_code']})")
    print(f'Logs: {log_dir.relative_to(ROOT)}')
    return 1 if any(r['status'] == 'failed' for r in results) else (2 if any(r['status'] == 'blocked' for r in results) else 0)


if __name__ == '__main__':
    sys.exit(main())
