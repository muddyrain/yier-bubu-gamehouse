"""Synthetic fixtures exercise evidence transport/decoding, never a GUI or gameplay."""
from __future__ import annotations

import importlib.util
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from check_gui_evidence import audit, describe_image

ROOT = Path(__file__).resolve().parents[2]


@unittest.skipUnless(importlib.util.find_spec('PIL'), 'Image decoding regression needs existing Pillow; no auto-install')
class EvidenceTests(unittest.TestCase):
    def fixture(self, path: Path, *, color='red', fmt='PNG', metadata=False):
        from PIL import Image, PngImagePlugin
        options = {}
        if metadata:
            meta = PngImagePlugin.PngInfo()
            meta.add_text('fixture', 'different bytes, same pixels')
            options['pnginfo'] = meta
        Image.new('RGB', (17, 11), color).save(path, format=fmt, **options)

    def test_dimensions_use_decoder_and_detect_mislabeled_jpeg(self):
        with tempfile.TemporaryDirectory() as work:
            directory = Path(work)
            self.fixture(directory / 'legacy.png', fmt='JPEG')
            info = describe_image(directory / 'legacy.png')
            self.assertEqual((info['width'], info['height'], info['format']), (17, 11, 'JPEG'))
            self.assertFalse(info['extension_matches'])
            self.assertEqual(audit(directory, [])['status'], 'failed')

    def test_duplicate_pixels_are_rejected_even_with_different_file_hashes(self):
        with tempfile.TemporaryDirectory() as work:
            directory = Path(work)
            self.fixture(directory / 'a.png')
            self.fixture(directory / 'b.png', metadata=True)
            result = audit(directory, ['a.png', 'b.png'])
            self.assertNotEqual(result['images'][0]['sha256'], result['images'][1]['sha256'])
            self.assertEqual(result['status'], 'failed')
            self.assertTrue(any('duplicate pixel_sha256' in error for error in result['errors']))
            self.fixture(directory / 'b.png', color='blue')
            self.assertEqual(audit(directory, ['a.png', 'b.png'])['status'], 'passed')
            (directory / 'bad.png').write_bytes(b'not an image')
            self.assertEqual(audit(directory, ['missing.png'])['status'], 'failed')

    def test_cli_never_overwrites_an_existing_index(self):
        with tempfile.TemporaryDirectory() as work:
            directory = Path(work)
            self.fixture(directory / 'a.png')
            output = directory / 'index.json'
            command = [sys.executable, '-B', str(ROOT / 'tools/check_gui_evidence.py'), str(directory), '--output', str(output)]
            first = subprocess.run(command, capture_output=True, timeout=10, shell=False)
            self.assertEqual(first.returncode, 0, first.stdout)
            original = output.read_bytes()
            self.assertEqual(json.loads(original)['width'], 17)
            second = subprocess.run(command, capture_output=True, timeout=10, shell=False)
            self.assertEqual(second.returncode, 2)
            self.assertEqual(output.read_bytes(), original)

    @unittest.skipUnless(shutil.which('node'), 'Byte transport regression needs existing Node')
    def test_capture_uses_explicit_current_bytes_and_rejects_repeats(self):
        with tempfile.TemporaryDirectory() as work:
            directory = Path(work)
            self.fixture(directory / 'a.png')
            self.fixture(directory / 'b.png', color='blue')
            # The same saver is called twice with changed bytes, matching the REPL seam.
            script = r'''
const {saveCapture} = require(process.argv[1]);
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
 const dir = process.argv[2], out = path.join(dir, 'output');
 let current = await fs.readFile(path.join(dir, 'a.png'));
 const first = await saveCapture(out, '01-first', current);
 current = await fs.readFile(path.join(dir, 'b.png'));
 const second = await saveCapture(out, '02-second', current);
 assert.notEqual(first.sha256, second.sha256);
 assert.deepEqual(await fs.readFile(path.join(out, second.file)), current);
 await assert.rejects(saveCapture(out, '03-stale', current), /Duplicate screenshot/);
 await assert.rejects(saveCapture(out, '../escape', current), /capture name/);
 assert.equal((await fs.readdir(out)).length, 2);
})().catch(error => {console.error(error); process.exitCode = 1;});
'''
            result = subprocess.run(['node', '-e', script, str(ROOT / 'tools/capture_evidence.cjs'), str(directory)],
                                    capture_output=True, timeout=10, shell=False)
            self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == '__main__':
    unittest.main()
