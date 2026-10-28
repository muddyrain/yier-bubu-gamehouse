// Runs only the engine-free TypeScript model; no cc stubs or GUI imports.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'client/assets/scripts/LobbyModel.ts'), 'utf8');
const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS },
    reportDiagnostics: true,
});
assert.equal(result.diagnostics.length, 0);
const model = {};
new Function('exports', result.outputText)(model);
let count = 0;
function check(name, run) {
    run();
    count++;
    console.log(`ok ${count} - ${name}`);
}

check('exact catalog with stable unique IDs and truthful availability', () => {
    assert.deepEqual(model.GAMES.map(g => [g.id, g.name, g.status]), [
        ['tower-defense', '一二布布守护小屋', 'coming-soon'],
        ['gold-miner', '一二布布黄金矿工', 'coming-soon'],
        ['merge', '一二布布合成乐园', 'coming-soon'],
        ['snake', '一二布布贪吃蛇', 'coming-soon'],
    ]);
    assert.equal(new Set(model.GAMES.map(g => g.id)).size, 4);
    assert.equal(model.CONTINUE_AVAILABLE, false);
    assert.equal(model.STATUS_TEXT['coming-soon'], '开发中');
});
check('equal protagonists have correct identity and contrasting original colors', () => {
    assert.deepEqual(model.CHARACTERS.map(c => [c.id, c.name, c.identity]), [
        ['yier', '一二', '小白熊'], ['bubu', '布布', '小棕熊'],
    ]);
    assert.equal(model.CHARACTERS[0].color, '#FFF9EF');
    assert.equal(model.CHARACTERS[1].color, '#B67B55');
    assert.deepEqual(model.LAYOUT.avatars.map(r => [r.width, r.height]), [[136, 136], [136, 136]]);
});
check('each card opens an honest notice and closes to the same home state', () => {
    for (const game of model.GAMES) {
        const state = model.navigate(model.HOME, { type: 'game', gameId: game.id });
        assert.equal(state.kind, 'notice');
        assert.equal(state.title, game.name);
        assert.match(state.body, /开发中/);
        assert.match(state.body, /尚未开放/);
        assert.equal(model.navigate(state, { type: 'close' }), model.HOME);
    }
});
check('help/settings/friends all have a return path and no fake functionality', () => {
    for (const type of ['help', 'settings', 'friends']) {
        const state = model.navigate(model.HOME, { type });
        assert.equal(state.kind, 'notice');
        assert.ok(state.title.length && state.body.length);
        assert.equal(model.navigate(state, { type: 'close' }), model.HOME);
    }
    assert.match(model.navigate(model.HOME, { type: 'friends' }).body, /未开放/);
    assert.match(model.navigate(model.HOME, { type: 'settings' }).body, /暂无可调整/);
});
check('three complete visits per entry never stack a second notice', () => {
    const actions = [...model.GAMES.map(g => ({ type: 'game', gameId: g.id })),
        { type: 'help' }, { type: 'settings' }, { type: 'friends' }];
    for (const action of actions) {
        let state = model.HOME;
        for (let visit = 0; visit < 3; visit++) {
            state = model.navigate(state, action);
            const open = state;
            state = model.navigate(state, { type: 'help' });
            assert.equal(state, open, 'a modal already owns navigation/input');
            state = model.navigate(state, { type: 'close' });
            assert.equal(state, model.HOME);
            assert.equal(model.navigate(state, { type: 'close' }), model.HOME);
        }
    }
});
check('unknown catalog ID remains recoverable without a scene load', () => {
    const state = model.navigate(model.HOME, { type: 'game', gameId: 'missing' });
    assert.equal(state.kind, 'notice');
    assert.match(state.body, /不存在/);
    assert.equal(model.navigate(state, { type: 'close' }), model.HOME);
});
check('all main hit rectangles fit inside the design frame with spacing', () => {
    const regions = [model.LAYOUT.hero, ...model.LAYOUT.cards, ...model.LAYOUT.toolbar];
    for (const r of regions) {
        assert.ok(Math.abs(r.x) + r.width / 2 <= model.DESIGN.width / 2 - 40);
        assert.ok(Math.abs(r.y) + r.height / 2 <= model.DESIGN.height / 2 - 40);
        assert.ok(r.width >= 104 && r.height >= 48);
    }
    for (let i = 0; i < regions.length; i++) {
        for (let j = i + 1; j < regions.length; j++) {
            const a = regions[i], b = regions[j];
            assert.ok(Math.abs(a.x - b.x) >= (a.width + b.width) / 2 ||
                Math.abs(a.y - b.y) >= (a.height + b.height) / 2, 'overlapping major regions');
        }
    }
});
check('16:9 / 4:3 / 21:9 use uniform containment with expected letterboxing', () => {
    for (const [width, height] of [[1280, 720], [2160, 1620], [840, 360]]) {
        const fit = model.fitDesign(width, height);
        assert.ok(fit.scale > 0);
        assert.ok(model.DESIGN.width * fit.scale <= width + 1e-9);
        assert.ok(model.DESIGN.height * fit.scale <= height + 1e-9);
        assert.ok(fit.paddingX >= 0 && fit.paddingY >= 0);
    }
    assert.equal(model.fitDesign(1280, 720).paddingX, 0);
    assert.ok(model.fitDesign(2160, 1620).paddingY > 0);
    assert.ok(model.fitDesign(840, 360).paddingX > 0);
    assert.throws(() => model.fitDesign(0, 720));
});
check('keyboard focus wraps and has no invalid index for one-item notices', () => {
    assert.equal(model.moveFocus(6, 7, 1), 0);
    assert.equal(model.moveFocus(0, 7, -1), 6);
    assert.equal(model.moveFocus(0, 1, 1), 0);
    assert.equal(model.moveFocus(0, 0, 1), 0);
});
console.log(`Lobby logic: ${count} checks passed. No Cocos or rendering executed.`);
