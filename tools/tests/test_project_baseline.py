"""Static Cocos source contracts; no engine import, GUI, network, or generated types."""
from __future__ import annotations

import json
import shutil
import subprocess
import unittest
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'client/assets'


def script_class_ids(value: str) -> set[str]:
    """Accept full UUID and Cocos' two compact class-ID formats without pinning a UUID."""
    digits = uuid.UUID(value).hex
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    results = {value}
    for prefix in (2, 5):
        encoded = digits[:prefix]
        for start in range(prefix, 32, 3):
            bits = int(digits[start:start + 3], 16)
            encoded += alphabet[bits >> 6] + alphabet[bits & 63]
        results.add(encoded)
    return results


class ProjectBaselineTests(unittest.TestCase):
    def test_engine_version_is_pinned(self) -> None:
        package = json.loads((ROOT / 'client/package.json').read_text(encoding='utf-8'))
        self.assertEqual(package['creator']['version'], '3.8.8')

    def test_project_defaults_use_landscape_and_preserve_the_full_design_area(self) -> None:
        project = json.loads((ROOT / 'client/settings/v2/packages/project.json').read_text(encoding='utf-8'))
        resolution = project['general']['designResolution']
        self.assertEqual((resolution['width'], resolution['height']), (1280, 720))
        self.assertIs(resolution['fitWidth'], True)
        self.assertIs(resolution['fitHeight'], True)

    def test_existing_startup_canvas_and_camera_match_landscape_defaults(self) -> None:
        objects = json.loads((ASSETS / 'scenes/Startup.scene').read_text(encoding='utf-8'))
        canvas = next(obj for obj in objects if obj.get('__type__') == 'cc.Node' and obj.get('_name') == 'Canvas')
        self.assertIs(canvas['_active'], True)
        self.assertEqual(tuple(canvas['_lpos'][axis] for axis in ('x', 'y', 'z')), (640, 360, 0))
        components = [objects[ref['__id__']] for ref in canvas['_components']]
        transform = next(obj for obj in components if obj['__type__'] == 'cc.UITransform')
        self.assertEqual((transform['_contentSize']['width'], transform['_contentSize']['height']), (1280, 720))
        self.assertEqual((transform['_anchorPoint']['x'], transform['_anchorPoint']['y']), (0.5, 0.5))
        canvas_component = next(obj for obj in components if obj['__type__'] == 'cc.Canvas')
        self.assertIs(canvas_component['_enabled'], True)
        self.assertIs(canvas_component['_alignCanvasWithScreen'], True)
        camera = objects[canvas_component['_cameraComponent']['__id__']]
        self.assertEqual(camera['__type__'], 'cc.Camera')
        self.assertIs(camera['_enabled'], True)
        self.assertEqual(camera['_projection'], 0, 'Startup needs its existing orthographic UI camera')
        self.assertEqual(camera['_orthoHeight'], 360)
        camera_node = objects[camera['node']['__id__']]
        self.assertIs(camera_node['_active'], True)
        self.assertIs(objects[camera_node['_parent']['__id__']], canvas)

    def test_assets_have_valid_unique_non_orphaned_metadata(self) -> None:
        identifiers = set()
        paths = list(ASSETS.rglob('*'))
        self.assertTrue(paths, 'Expected actual authored assets')
        for path in paths:
            with self.subTest(asset=path.relative_to(ROOT).as_posix()):
                if path.suffix == '.meta':
                    self.assertTrue(path.with_suffix('').exists(), 'Orphaned meta')
                    meta = json.loads(path.read_text(encoding='utf-8'))
                    identifier = uuid.UUID(meta['uuid'])
                    self.assertNotIn(identifier, identifiers, 'Duplicate asset UUID')
                    identifiers.add(identifier)
                else:
                    self.assertTrue(Path(str(path) + '.meta').is_file(), 'Missing asset meta')

    def test_startup_references_existing_objects_and_current_script_meta(self) -> None:
        objects = json.loads((ASSETS / 'scenes/Startup.scene').read_text(encoding='utf-8'))
        self.assertEqual(objects[0]['__type__'], 'cc.SceneAsset')

        def check_references(value):
            if isinstance(value, dict):
                if '__id__' in value:
                    self.assertIs(type(value['__id__']), int)
                    self.assertTrue(0 <= value['__id__'] < len(objects), 'Dangling scene object')
                for child in value.values():
                    check_references(child)
            elif isinstance(value, list):
                for child in value:
                    check_references(child)

        check_references(objects)
        scene = objects[objects[0]['scene']['__id__']]
        self.assertEqual(scene['__type__'], 'cc.Scene')
        scene_meta = json.loads((ASSETS / 'scenes/Startup.scene.meta').read_text(encoding='utf-8'))
        self.assertEqual(scene['_id'], scene_meta['uuid'])
        canvas = next(obj for obj in objects if obj.get('__type__') == 'cc.Node' and obj.get('_name') == 'Canvas')
        script_meta = json.loads((ASSETS / 'scripts/SmokeTest.ts.meta').read_text(encoding='utf-8'))
        expected_types = script_class_ids(script_meta['uuid'])
        components = [objects[ref['__id__']] for ref in canvas['_components']]
        scripts = [component for component in components if component['__type__'] in expected_types]
        self.assertEqual(len(scripts), 1, 'Canvas must retain exactly one SmokeTest reference')
        self.assertIs(scripts[0]['_enabled'], True)
        self.assertIs(objects[scripts[0]['node']['__id__']], canvas)

    @unittest.skipUnless((ROOT / '.git').exists() and shutil.which('git'), 'Ignore-rule test needs the original Git checkout')
    def test_git_retains_sources_and_ignores_machine_outputs(self) -> None:
        private_configs = ['client/settings/v2/packages/cocos-service.json',
                           'client/settings/v2/packages/information.json']
        ignored = ['.local/environment.json', 'node_modules/typescript/lib/tsc.js',
                   'client/temp/tsconfig.cocos.json', 'client/profiles/v2/packages/scene.json',
                   'client/library/cache.json', 'tools/__pycache__/example.pyc', *private_configs]
        retained = [p.relative_to(ROOT).as_posix() for p in ASSETS.rglob('*') if p.is_file()]
        retained += ['client/package.json', 'client/settings/v2/packages/project.json',
                     'client/settings/v2/packages/engine.json', 'client/tsconfig.json', 'package-lock.json']
        # Disable global excludes; verbose origins must resolve to project rules.
        # NUL input avoids Windows CRLF becoming part of filenames in Git's stdin.
        result = subprocess.run(
            ['git', '-c', 'core.excludesFile=', 'check-ignore', '-v', '--no-index', '--stdin', '-z'], cwd=ROOT,
            input=('\0'.join(ignored + retained) + '\0').encode(), capture_output=True,
            timeout=10, check=False, shell=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr.decode(errors='replace'))
        fields = result.stdout.decode().split('\0')[:-1]
        self.assertEqual(len(fields) % 4, 0)
        sources = {fields[i + 3]: fields[i] for i in range(0, len(fields), 4)}
        self.assertEqual(set(sources), set(ignored))
        for source in sources.values():
            self.assertIn(source, {'.gitignore', 'client/.gitignore'}, 'Ignore rule must belong to the project')
        tracked = subprocess.run(
            ['git', 'ls-files', '-z', '--', *private_configs], cwd=ROOT,
            capture_output=True, timeout=10, check=False, shell=False,
        )
        self.assertEqual(tracked.returncode, 0)
        self.assertEqual(tracked.stdout, b'', 'Private Cocos configuration must remain untracked')


if __name__ == '__main__':
    unittest.main()
