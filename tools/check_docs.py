#!/usr/bin/env python3
"""Read-only Markdown documentation checker. No Cocos, GUI, network, or file writes."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / 'docs'
FEATURE_DIR = DOC / 'features'
FEATURE_INDEX = DOC / 'FEATURES.md'
ERRORS: list[str] = []


def error(message: str) -> None:
    ERRORS.append(message)


def validate_links(markdown_file: Path, body: str) -> int:
    count = 0
    # Deliberately checks regular inline Markdown links only; no browser/network usage.
    for match in re.finditer(r'(?<!!)\[[^\]\n]+\]\(([^)]+)\)', body):
        raw = match.group(1)
        if raw.startswith(('https://', 'http://', 'mailto:', '#')):
            continue
        target = unquote(raw.split('#', 1)[0])
        if not target:
            continue
        count += 1
        resolved = (markdown_file.parent / target).resolve()
        if not resolved.is_relative_to(ROOT.resolve()):
            error(f'{markdown_file.relative_to(ROOT)}: link escapes repository: {target}')
        elif not resolved.exists():
            error(f'{markdown_file.relative_to(ROOT)}: broken link: {target}')
    return count


def markdown_paths(root: Path) -> list[Path]:
    # Only authored documentation belongs to this contract, not dependencies,
    # imported engine caches, or ignored local validation evidence.
    return sorted([root / 'AGENTS.md', root / 'README.md', *(root / 'docs').rglob('*.md')])


def main() -> int:
    paths = markdown_paths(ROOT)
    link_count = 0
    for p in paths:
        body = p.read_text(encoding='utf-8')
        if not body.startswith('# '):
            error(f'{p.relative_to(ROOT)}: first line must be H1 title')
        link_count += validate_links(p, body)

    idx = FEATURE_INDEX.read_text(encoding='utf-8')
    rows = {}
    for match in re.finditer(r'^\| (FEAT-\d{3}) \| \[([^\]]+)\]\((features\/FEAT-\d{3}-[^)]+\.md)\)', idx, re.M):
        fid, _, dest = match.groups()
        if fid in rows:
            error(f'duplicate feature ID {fid} in FEATURES.md')
        rows[fid] = dest
        if not (DOC / dest).exists():
            error(f'feature index target missing: {dest}')
    actual = {p.name[:8]: p for p in FEATURE_DIR.glob('FEAT-*.md')}
    if len(actual) != len(list(FEATURE_DIR.glob('FEAT-*.md'))):
        error('duplicate/invalid feature IDs in filenames')
    if set(rows) != set(actual):
        error(f'index/feature file ID mismatch: index_only={set(rows)-set(actual)}, file_only={set(actual)-set(rows)}')
    sections = [
        '## 1. 目标与用户故事',
        '## 2. 玩法 / 交互与状态',
        '## 3. 范围与非范围',
        '## 4. 数据与依赖',
        '## 5. 验收标准',
        '## 6. 验证方法',
        '## 7. 依赖、风险、文档联动',
    ]
    for fid, p in actual.items():
        content = p.read_text(encoding='utf-8')
        if not content.startswith(f'# {fid} — '):
            error(f'{p.relative_to(ROOT)}: incorrect H1 for feature ID')
        for section in sections:
            if section not in content:
                error(f'{p.relative_to(ROOT)}: missing section {section}')
        if not re.search(r'\*\*AC-01\*\*', content):
            error(f'{p.relative_to(ROOT)}: missing acceptance criteria AC-01')
        if 'macOS CLI' not in content or 'Windows GUI' not in content:
            error(f'{p.relative_to(ROOT)}: missing OS-specific verification')
    for path in ['AGENTS.md', 'README.md', 'docs/DEV_ENVIRONMENT.md', 'docs/DOC_RULES.md']:
        if not (ROOT / path).exists():
            error(f'missing mandatory file: {path}')

    if ERRORS:
        print(f'DOCS CHECK FAILED: {len(ERRORS)} issue(s), {len(paths)} Markdown files, {len(rows)} features, {link_count} relative links')
        for issue in ERRORS:
            print(' -', issue)
        return 1
    print(f'DOCS CHECK PASSED: {len(paths)} Markdown files, {len(rows)} feature docs, {link_count} relative links')
    print('Note: only static documentation checks ran; no game, editor, GUI, or device test was executed.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
