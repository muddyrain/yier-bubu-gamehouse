// Executes the actual engine-free model and inspects the view AST. Never loads cc or a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, 'client/assets/scripts', name), 'utf8');
const output = ts.transpileModule(read('LobbyModel.ts'), {
    compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS }, reportDiagnostics: true,
});
assert.equal(output.diagnostics.length, 0);
const m = {};
new Function('exports', output.outputText)(m);
const act = m.transitionLobby;
const open = state => act(state, { type: 'characters' });
const choose = (state, id) => act(state, { type: 'choose-character', characterId: id });
const confirm = state => act(state, { type: 'confirm-character' });
const back = state => act(state, { type: 'close' });
let count = 0;
function check(name, run) { run(); console.log(`ok ${++count} - ${name}`); }

check('first entry is neutral, cannot confirm and returns to home', () => {
    const state = open(m.INITIAL_LOBBY);
    assert.equal(state.screen.draft, null);
    assert.equal(state.choice, null);
    assert.equal(state.screen.phase, 'choosing');
    assert.equal(confirm(state), state);
    assert.equal(back(state).screen, m.HOME);
    assert.equal(back(state).choice, null);
});
check('both stable IDs confirm equally and produce immutable typed local results', () => {
    for (const id of ['yier', 'bubu']) {
        const draft = choose(open(m.INITIAL_LOBBY), id);
        assert.equal(draft.choice, null, 'selecting is not confirming');
        const state = confirm(draft);
        assert.deepEqual(state.choice, { characterId: id });
        assert.ok(Object.isFrozen(state.choice));
        assert.equal(state.screen.phase, 'confirmed');
        assert.equal(confirm(state), state, 'duplicate confirmation is idempotent');
        assert.match(m.characterStatus(state.screen), new RegExp(`已选择${id === 'yier' ? '一二' : '布布'}，游戏仍在开发中`));
        assert.match(m.characterStatus(state.screen), /未开始游戏或保存/);
    }
});
check('unknown input never becomes a character or silently falls back to bubu', () => {
    const invalid = ['', 'BUBU', ' yier', 'yier ', 'constructor', '__proto__', 0, null, undefined, {}, [], true];
    const initial = open(m.INITIAL_LOBBY);
    for (const value of invalid) {
        assert.equal(m.isCharacterId(value), false);
        const state = choose(initial, value);
        assert.equal(state.screen.draft, null);
        assert.equal(state.choice, null);
        assert.match(state.screen.error, /角色不可用/);
        assert.equal(confirm(state), state);
    }
    for (const character of m.CHARACTERS) assert.equal(m.isCharacterId(character.id), true);
});
check('invalid input preserves a valid draft/result and the error can recover', () => {
    const saved = back(confirm(choose(open(m.INITIAL_LOBBY), 'yier')));
    const invalid = choose(choose(open(saved), 'bubu'), 'missing');
    assert.equal(invalid.screen.draft, 'bubu');
    assert.deepEqual(invalid.choice, { characterId: 'yier' });
    const recovered = choose(invalid, 'yier');
    assert.equal(recovered.screen.error, null);
    assert.equal(confirm(recovered).choice.characterId, 'yier');
    assert.equal(confirm({ ...invalid, screen: { ...invalid.screen, draft: 'missing' } }).choice, invalid.choice);
});
check('cancel discards a draft; re-entry recalls only the last confirmation', () => {
    let state = back(choose(open(m.INITIAL_LOBBY), 'bubu'));
    assert.equal(open(state).screen.draft, null);
    state = back(confirm(choose(open(state), 'yier')));
    const cancelled = back(choose(open(state), 'bubu'));
    assert.equal(open(cancelled).screen.draft, 'yier');
    assert.equal(cancelled.choice.characterId, 'yier');
});
check('reselect unlocks both choices; switching does not commit until confirmed', () => {
    const first = confirm(choose(open(m.INITIAL_LOBBY), 'yier'));
    assert.equal(choose(first, 'bubu'), first, 'confirmed screen must be explicitly unlocked');
    let state = act(first, { type: 'reselect' });
    assert.equal(state.screen.phase, 'choosing');
    state = choose(state, 'bubu');
    assert.equal(state.choice.characterId, 'yier');
    assert.equal(confirm(state).choice.characterId, 'bubu');
});
check('three visits per character and all seven original entries stay single-layer', () => {
    let state = m.INITIAL_LOBBY;
    const entries = [...m.GAMES.map(g => ({ type: 'game', gameId: g.id })), ...['friends', 'help', 'settings'].map(type => ({ type }))];
    for (const id of ['yier', 'bubu']) {
        for (let i = 0; i < 3; i++) {
            state = open(state);
            assert.equal(open(state), state);
            for (const entry of entries) assert.equal(act(state, entry), state, 'overlay blocks home actions');
            state = back(confirm(choose(state, id)));
            for (const entry of entries) {
                const notice = act(state, entry);
                assert.equal(notice.screen.kind, 'notice');
                assert.equal(open(notice), notice);
                assert.equal(choose(notice, 'yier'), notice);
                state = back(notice);
                assert.equal(state.choice.characterId, id);
            }
        }
    }
});
check('closing for component suspension keeps only confirmed preference; new instance resets', () => {
    const confirmed = confirm(choose(open(m.INITIAL_LOBBY), 'yier'));
    const suspended = back(choose(act(confirmed, { type: 'reselect' }), 'bubu'));
    assert.equal(suspended.screen, m.HOME);
    assert.equal(open(suspended).screen.draft, 'yier');
    assert.equal(m.INITIAL_LOBBY.choice, null, 'new instances cannot inherit another lobby preference');
});
check('character hit areas are symmetric, spaced, contained and uniformly fit three ratios', () => {
    const layout = m.SELECTION_LAYOUT;
    const [a, b] = layout.cards;
    assert.equal(a.x, -b.x);
    assert.deepEqual([a.width, a.height, a.y], [b.width, b.height, b.y]);
    const regions = [...layout.cards, ...layout.buttons];
    for (const box of regions) {
        assert.ok(Math.abs(box.x) + box.width / 2 < layout.panel.width / 2);
        assert.ok(Math.abs(box.y) + box.height / 2 < layout.panel.height / 2);
        assert.ok(box.height >= 48);
    }
    for (let i = 0; i < regions.length; i++) for (let j = i + 1; j < regions.length; j++) {
        const x = regions[i], y = regions[j];
        assert.ok(Math.abs(x.x-y.x) >= (x.width+y.width)/2 || Math.abs(x.y-y.y) >= (x.height+y.height)/2);
    }
    for (const [width, height] of [[1280, 720], [2160, 1620], [840, 360]]) {
        const { scale } = m.fitDesign(width, height);
        assert.ok(layout.panel.width * scale <= width && layout.panel.height * scale <= height);
    }
});
check('focus wrapping handles every available character panel count', () => {
    for (const length of [2, 3, 4]) for (let i = 0; i < length; i++) {
        assert.equal(m.moveFocus(m.moveFocus(i, length, 1), length, -1), i);
    }
});

// Static contracts inspect actual source structure; they do not simulate Cocos lifecycle timing.
const view = ts.createSourceFile('LobbyView.ts', read('LobbyView.ts'), ts.ScriptTarget.Latest, true);
const cls = view.statements.find(n => ts.isClassDeclaration(n) && n.name.text === 'LobbyView');
const method = name => cls.members.find(n => ts.isMethodDeclaration(n) && n.name.getText(view) === name);
function calls(node) {
    const found = [];
    function visit(n) { if (ts.isCallExpression(n)) found.push(n); ts.forEachChild(n, visit); }
    visit(node); return found;
}
check('all subscriptions have matching cleanup with the same function and target', () => {
    const subscriptions = (name, suffix) => calls(method(name)).filter(n => n.expression.getText(view).endsWith(suffix))
        .map(n => n.expression.expression.getText(view) + ':' + n.arguments.map(a => a.getText(view)).join('|')).sort();
    assert.deepEqual(subscriptions('onEnable', '.on'), subscriptions('onDisable', '.off'));
    assert.equal(subscriptions('onEnable', '.on').length, 3, 'button loop, size, keyboard');
    for (const name of ['dispatch', 'render', 'createCharacterSelection', 'onKeyDown']) {
        assert.equal(calls(method(name)).filter(n => /\.(on|off)$/.test(n.expression.getText(view))).length, 0);
    }
    assert.equal(calls(method('onDisable')).filter(n => n.expression.getText(view) === 'transitionLobby').length, 1);
    assert.match(method('onDisable').getText(view), /type: 'close'/);
});
check('UI builds once in onLoad, uses one input mask and keeps the safe destroy guard', () => {
    const loadCalls = calls(method('onLoad')).map(n => n.expression.getText(view));
    for (const builder of ['this.createHero', 'this.createNotice', 'this.createCharacterSelection']) {
        assert.equal(loadCalls.filter(name => name === builder).length, 1);
    }
    for (const name of ['render', 'dispatch', 'onEnable']) {
        assert.equal(calls(method(name)).filter(n => /this\.(create\w+|nodeBox|control)$/.test(n.expression.getText(view))).length, 0);
    }
    assert.equal(calls(view).filter(n => n.expression.getText(view) === 'this.overlay.addComponent' && n.arguments[0]?.getText(view) === 'BlockInputEvents').length, 1);
    assert.match(method('onDestroy').getText(view), /if \(isValid\(this.root, true\)\) this.root.destroy\(\)/);
});
check('view gates focus and clicks by active controls and consumes all keyboard navigation keys', () => {
    assert.match(method('activeControls').getText(view), /control.node.active && control.button.interactable/);
    assert.match(method('control').getText(view), /if \(index < 0\) return/);
    for (const key of ['TAB', 'ARROW_LEFT', 'ARROW_RIGHT', 'ARROW_UP', 'ARROW_DOWN', 'ENTER', 'SPACE', 'ESCAPE']) {
        assert.ok(method('onKeyDown').getText(view).includes(`KeyCode.${key}`));
    }
    assert.match(method('render').getText(view), /confirmCharacter.button.interactable = choosing && screen.draft !== null/);
});
console.log(`Character selection: ${count} checks passed. No engine or rendering executed.`);
