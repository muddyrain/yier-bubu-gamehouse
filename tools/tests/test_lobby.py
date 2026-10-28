"""P1-02 source/scene contracts and bounded execution of real pure TS logic."""
from __future__ import annotations

import json
import shutil
import subprocess
import unittest
from pathlib import Path

from test_project_baseline import script_class_ids

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'client/assets'


class LobbyTests(unittest.TestCase):
    def test_pure_lobby_logic(self) -> None:
        node = shutil.which('node')
        self.assertIsNotNone(node, 'Lobby logic checks require Node and locked TypeScript; no GUI fallback')
        self.assertTrue((ROOT / 'node_modules/typescript/lib/typescript.js').is_file(), 'Install locked dependencies first')
        result = subprocess.run([node, str(ROOT / 'tools/tests/lobby_model.test.cjs')], cwd=ROOT,
                                capture_output=True, timeout=10, shell=False)
        print(result.stdout.decode('utf-8', errors='replace'), end='')
        self.assertEqual(result.returncode, 0, result.stderr.decode('utf-8', errors='replace'))
        self.assertIn(b'9 checks passed', result.stdout)

    def test_lobby_is_a_separate_valid_scene_with_its_current_view(self) -> None:
        objects = json.loads((ASSETS / 'scenes/Lobby.scene').read_text(encoding='utf-8'))
        meta = json.loads((ASSETS / 'scenes/Lobby.scene.meta').read_text(encoding='utf-8'))
        view_meta = json.loads((ASSETS / 'scripts/LobbyView.ts.meta').read_text(encoding='utf-8'))
        scene = objects[objects[0]['scene']['__id__']]
        self.assertEqual(scene['_name'], 'Lobby')
        self.assertEqual(scene['_id'], meta['uuid'])
        startup = json.loads((ASSETS / 'scenes/Startup.scene.meta').read_text(encoding='utf-8'))
        self.assertNotEqual(meta['uuid'], startup['uuid'])
        canvas = next(o for o in objects if o.get('_name') == 'Canvas')
        components = [objects[r['__id__']] for r in canvas['_components']]
        views = [o for o in components if o['__type__'] in script_class_ids(view_meta['uuid'])]
        self.assertEqual(len(views), 1)
        self.assertIs(views[0]['_enabled'], True)
        self.assertIs(objects[views[0]['node']['__id__']], canvas)
        transform = next(o for o in components if o['__type__'] == 'cc.UITransform')
        self.assertEqual((transform['_contentSize']['width'], transform['_contentSize']['height']), (1280, 720))

        def check_refs(value):
            if isinstance(value, dict):
                if '__id__' in value:
                    self.assertIs(type(value['__id__']), int)
                    self.assertTrue(0 <= value['__id__'] < len(objects))
                for child in value.values():
                    check_refs(child)
            elif isinstance(value, list):
                for child in value:
                    check_refs(child)
        check_refs(objects)


if __name__ == '__main__':
    unittest.main()
