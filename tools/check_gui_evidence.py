#!/usr/bin/env python3
"""Audit saved PNG/JPEG bytes; never captures screens or starts a GUI.

Requires existing Pillow (no automatic install). Output uses exclusive creation.
File/pixel hashes detect repeats, not whether an action or a UI assertion passed.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import struct
from pathlib import Path

MAX_BYTES = 32 * 1024 * 1024
MAX_PIXELS = 16_000_000


def describe_image(path: Path) -> dict:
    from PIL import Image

    if path.stat().st_size > MAX_BYTES:
        raise ValueError('Image exceeds 32 MiB')
    data = path.read_bytes()
    # Detect using the decoder, not the extension or a fixed PNG header offset.
    with Image.open(io.BytesIO(data)) as image:
        if image.format not in ('PNG', 'JPEG') or getattr(image, 'n_frames', 1) != 1:
            raise ValueError('Expected a single PNG/JPEG frame')
        width, height = image.size
        if width * height > MAX_PIXELS:
            raise ValueError('Image exceeds 16 megapixels')
        image.load()  # Reject truncated/undecodable files, not only bad headers.
        pixels = image.convert('RGBA').tobytes()
        decoded = hashlib.sha256(struct.pack('>II', width, height) + pixels).hexdigest()
        expected = {'.png'} if image.format == 'PNG' else {'.jpg', '.jpeg'}
        return {
            'file': path.name, 'format': image.format, 'width': width, 'height': height,
            'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
            'pixel_sha256': decoded, 'extension_matches': path.suffix.lower() in expected,
        }


def audit(directory: Path, distinct: list[str]) -> dict:
    paths = sorted(p for p in directory.iterdir() if p.suffix.lower() in ('.png', '.jpg', '.jpeg'))
    if not paths or len(paths) > 100:
        raise ValueError('Expected 1 to 100 images')
    images, errors = [], []
    for path in paths:
        try:
            info = describe_image(path)
            images.append(info)
            if not info['extension_matches']:
                errors.append(f'{path.name}: extension does not match decoded format')
        except (OSError, ValueError) as error:
            errors.append(f'{path.name}: {error}')
    by_name = {info['file']: info for info in images}
    seen_bytes, seen_pixels = {}, {}
    for name in distinct:
        if name not in by_name:
            errors.append(f'{name}: missing or undecodable required state')
            continue
        info = by_name[name]
        for field, seen in [('sha256', seen_bytes), ('pixel_sha256', seen_pixels)]:
            value = info[field]
            if value in seen:
                errors.append(f'{name}: duplicate {field} of {seen[value]}')
            seen[value] = name
    sizes = sorted({(info['width'], info['height']) for info in images})
    return {
        'status': 'failed' if errors else 'passed',
        'width': sizes[0][0] if len(sizes) == 1 else None,
        'height': sizes[0][1] if len(sizes) == 1 else None,
        'sizes': [{'width': w, 'height': h} for w, h in sizes],
        'images': images, 'required_distinct': distinct, 'errors': errors,
        'scope': 'Decoded sizes and byte/pixel identity only; UI semantics require visual review.',
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--distinct', nargs='+', default=[])
    args = parser.parse_args()
    try:
        result = audit(args.directory, args.distinct)
        with args.output.open('x', encoding='utf-8') as target:
            json.dump(result, target, ensure_ascii=False, indent=2)
            target.write('\n')
    except (ImportError, OSError, ValueError) as error:
        print(f'blocked: {error}')
        return 2
    print(f"{result['status']}: {len(result['images'])} decoded images; {len(result['errors'])} findings")
    return 1 if result['errors'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
