'use strict';
// Executes real engine-free TypeScript. Lifecycle probes model only the module interface, never Cocos.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const cache = new Map();
function load(name) {
    assert.ok(['LobbyModel', 'GameLifecycle', 'CounterModel'].includes(name), 'Only engine-free production modules may execute');
    if (cache.has(name)) return cache.get(name);
    const source = fs.readFileSync(path.join(root, 'client/assets/scripts', name + '.ts'), 'utf8');
    const result = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.CommonJS }, reportDiagnostics: true });
    assert.equal(result.diagnostics.length, 0);
    const value = {};
    cache.set(name, value);
    new Function('exports', 'require', result.outputText)(value, request => {
        assert.match(request, /^\.\/[A-Za-z]+$/);
        return load(request.slice(2));
    });
    return value;
}
const m = load('LobbyModel');
const { GameFlow, GameRegistry, DEVELOPMENT_GAME_ID } = load('GameLifecycle');
const { CounterModel, COUNTER_LAYOUT } = load('CounterModel');
const choice = id => ({ characterId: id });
function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}
function probe(plan = {}) {
    const calls = [];
    const value = { calls, model: null, token: null,
        load(session, token) {
            calls.push('load'); this.model = new CounterModel(session); this.token = token;
            if (plan.loadError) throw plan.loadError;
            return plan.wait?.promise;
        },
        enter() { calls.push('enter'); this.model.enter(); if (plan.enterError) throw plan.enterError; },
        pause() { calls.push('pause'); this.model.pause(); if (plan.pauseError) throw plan.pauseError; },
        resume() { calls.push('resume'); this.model.resume(); if (plan.resumeError) throw plan.resumeError; },
        exit() { calls.push('exit'); if (plan.exitError) throw plan.exitError; this.model?.dispose(); },
        dispose() { calls.push('dispose'); if (plan.disposeError) throw plan.disposeError; this.model?.dispose(); },
    };
    return value;
}
function owner(factory = () => probe(), ids = [DEVELOPMENT_GAME_ID]) {
    const modules = [], states = [], errors = [];
    const registry = new GameRegistry(ids.map(id => ({ id, modes: ['solo'], create() {
        const instance = factory(id); modules.push(instance); return instance;
    } })));
    const flow = new GameFlow(registry, state => states.push(state), error => errors.push(error));
    return { flow, registry, modules, states, errors };
}
const start = (flow, id = DEVELOPMENT_GAME_ID, selected = 'yier') => flow.start(id, 'solo', choice(selected));
let count = 0;
async function check(name, fn) { await fn(); console.log(`ok ${++count} - ${name}`); }

async function main() {
    await check('four formal games stay coming-soon and outside the executable registry', async () => {
        const o = owner();
        assert.equal(m.GAMES.length, 4);
        for (const game of m.GAMES) {
            assert.equal(game.status, 'coming-soon');
            assert.equal((await start(o.flow, game.id)).ok, false);
        }
        assert.equal(o.modules.length, 0);
    });
    await check('registry rejects duplicates/invalid registrations and owns frozen descriptors', () => {
        assert.throws(() => new GameRegistry([{ id: 'a', modes: ['solo'] }, { id: 'a', modes: ['solo'] }]), /registration/);
        assert.throws(() => new GameRegistry([{ id: '../bad', modes: ['solo'] }]), /registration/);
        assert.throws(() => new GameRegistry([{ id: 'a', modes: [] }]), /registration/);
        const modes = ['solo'];
        const source = { id: 'fixture-a', modes, create: () => probe() };
        const registry = new GameRegistry([source]);
        modes[0] = 'coop'; source.id = 'changed';
        assert.deepEqual(registry.find('fixture-a').modes, ['solo']);
        assert.ok(Object.isFrozen(registry.find('fixture-a')));
        assert.ok(Object.isFrozen(registry.find('fixture-a').modes));
        assert.equal(registry.find('__proto__'), undefined);
    });
    await check('unknown or non-string game IDs never create a module/session', async () => {
        const o = owner();
        for (const id of ['missing', '', '__proto__', null, undefined, {}, 42]) {
            assert.equal((await o.flow.start(id, 'solo', choice('yier'))).ok, false);
            assert.equal(o.flow.snapshot.stage, 'idle');
            assert.equal(o.flow.snapshot.session, null);
            assert.ok(o.flow.snapshot.error);
        }
        assert.equal(o.modules.length, 0);
    });
    await check('invalid or unsupported modes do not start or silently become solo', async () => {
        const o = owner();
        for (const mode of ['coop', 'versus', 'SOLO', '', null, {}, undefined]) {
            assert.equal((await o.flow.start(DEVELOPMENT_GAME_ID, mode, choice('yier'))).ok, false);
        }
        assert.equal(o.modules.length, 0);
        assert.equal(o.flow.snapshot.session, null);
    });
    await check('unconfirmed and illegal character inputs remain recoverable', async () => {
        const o = owner();
        for (const input of [null, undefined, {}, choice(''), choice('YIER'), choice(' bubu'), choice('__proto__'), choice(0)]) {
            assert.equal((await o.flow.start(DEVELOPMENT_GAME_ID, 'solo', input)).ok, false);
            assert.equal(o.flow.snapshot.stage, 'idle');
        }
        assert.equal(o.modules.length, 0);
        assert.equal((await start(o.flow, DEVELOPMENT_GAME_ID, 'bubu')).ok, true);
        o.flow.exit();
    });
    await check('both roles enter the same ID with copied, frozen typed sessions', async () => {
        for (const id of ['yier', 'bubu']) {
            const o = owner(); const input = choice(id);
            const pending = o.flow.start(DEVELOPMENT_GAME_ID, 'solo', input);
            input.characterId = 'corrupted';
            assert.equal((await pending).ok, true);
            const session = o.flow.snapshot.session;
            assert.deepEqual(Object.keys(session).sort(), ['sessionId', 'gameId', 'mode', 'characterId'].sort());
            assert.equal(session.characterId, id);
            assert.equal(session.gameId, DEVELOPMENT_GAME_ID);
            assert.equal(session.mode, 'solo');
            assert.ok(Object.isFrozen(session));
            assert.ok(Object.isFrozen(o.flow.snapshot));
            assert.throws(() => { session.characterId = 'bubu'; }, TypeError);
            assert.equal(o.modules[0].model.session, session);
            o.flow.exit();
        }
        const o = owner();let reads = 0;
        const getter = { get characterId() { return ++reads === 1 ? 'yier' : 'invalid'; } };
        assert.equal((await o.flow.start(DEVELOPMENT_GAME_ID, 'solo', getter)).ok, true);
        assert.equal(reads, 1);assert.equal(o.flow.snapshot.session.characterId, 'yier');o.flow.exit();
    });
    await check('load precedes enter and blocks fast/repeated entry requests', async () => {
        const wait = deferred(), instance = probe({ wait });
        const o = owner(() => instance);const pending = start(o.flow);
        assert.equal(o.flow.snapshot.stage, 'loading');
        assert.deepEqual(instance.calls, ['load']);
        assert.equal((await start(o.flow)).ok, false);
        o.flow.pause();o.flow.resume();assert.deepEqual(instance.calls, ['load']);
        wait.resolve();assert.equal((await pending).ok, true);
        assert.deepEqual(instance.calls, ['load', 'enter']);
        assert.equal((await start(o.flow)).ok, false);
        assert.equal(o.modules.length, 1);o.flow.exit();
    });
    await check('real counter advances the target and pauses/resumes without adding input', async () => {
        const o = owner();await start(o.flow);const model = o.modules[0].model;
        assert.equal(model.hit(), true);assert.equal(model.count, 1);assert.equal(model.target, 1);
        o.flow.pause();o.flow.pause();assert.equal(o.flow.snapshot.stage, 'paused');
        assert.equal(model.hit(), false);assert.equal(model.count, 1);
        o.flow.resume();o.flow.resume();assert.equal(o.flow.snapshot.stage, 'running');
        assert.equal(model.hit(), true);assert.equal(model.count, 2);
        assert.equal(o.modules[0].calls.filter(x => x === 'pause').length, 1);
        assert.equal(o.modules[0].calls.filter(x => x === 'resume').length, 1);o.flow.exit();
    });
    await check('exit/dispose are ordered and idempotent and old counter references stay inert', async () => {
        const o = owner();await start(o.flow);const module = o.modules[0], model = module.model;
        model.hit();o.flow.exit();o.flow.exit();o.flow.pause();o.flow.resume();
        assert.deepEqual(module.calls, ['load', 'enter', 'exit', 'dispose']);
        assert.equal(model.hit(), false);model.enter();model.resume();assert.equal(model.hit(), false);
        assert.equal(model.count, 0);assert.equal(o.flow.snapshot.session, null);assert.equal(o.flow.snapshot.stage, 'idle');
        o.flow.dispose();o.flow.dispose();assert.equal((await start(o.flow)).ok, false);
    });
    await check('each role completes three pure module visits with fresh counts and session IDs', async () => {
        const o = owner(), ids = new Set();
        for (const role of ['yier', 'bubu']) for (let i = 0; i < 3; i++) {
            await start(o.flow, DEVELOPMENT_GAME_ID, role);
            assert.equal(o.flow.snapshot.session.characterId, role);
            ids.add(o.flow.snapshot.session.sessionId);
            assert.equal(o.modules.at(-1).model.count, 0);o.modules.at(-1).model.hit();
            o.flow.exit();assert.equal(o.flow.snapshot.session, null);
        }
        assert.equal(ids.size, 6);assert.equal(o.modules.length, 6);
        assert.ok(o.modules.every(instance => instance.model.status === 'disposed'));
    });
    await check('different registered fixture IDs and new instances never share counter state', async () => {
        const o = owner(() => probe(), ['fixture-a', 'fixture-b']);
        await start(o.flow, 'fixture-a');const first = o.modules[0].model;first.hit();first.hit();o.flow.exit();
        await start(o.flow, 'fixture-b');const second = o.modules[1].model;
        assert.notEqual(first, second);assert.equal(second.session.gameId, 'fixture-b');assert.equal(second.count, 0);
        second.hit();assert.equal(first.hit(), false);assert.equal(first.count, 0);o.flow.exit();
        await start(o.flow, 'fixture-a');assert.equal(o.modules[2].model.count, 0);o.flow.exit();
    });
    await check('cancelling a pending load frees the owner immediately; a late success cannot re-enter', async () => {
        const wait = deferred(), stale = probe({ wait });let calls = 0;
        const o = owner(() => ++calls === 1 ? stale : probe());const pending = start(o.flow);
        o.flow.exit();assert.equal(stale.token.cancelled, true);assert.equal(o.flow.snapshot.stage, 'idle');
        await start(o.flow, DEVELOPMENT_GAME_ID, 'bubu');const current = o.flow.snapshot.session;
        wait.resolve();assert.equal((await pending).ok, false);
        assert.equal(o.flow.snapshot.session, current);assert.equal(current.characterId, 'bubu');
        assert.deepEqual(stale.calls, ['load', 'exit', 'dispose']);o.flow.exit();
    });
    await check('a cancelled load rejection is logged without corrupting a newer session', async () => {
        const wait = deferred();let calls = 0;
        const o = owner(() => ++calls === 1 ? probe({ wait }) : probe());const pending = start(o.flow);
        o.flow.exit();await start(o.flow);const current = o.flow.snapshot.session;
        const error = new Error('expected late load failure');wait.reject(error);
        assert.equal((await pending).ok, false);assert.equal(o.errors[0], error);
        assert.equal(o.flow.snapshot.session, current);assert.equal(o.flow.snapshot.stage, 'running');o.flow.exit();
    });
    await check('factory/load/enter failures each recover to idle and allow a fresh valid start', async () => {
        for (const point of ['factory', 'loadError', 'enterError']) {
            const error = new Error('expected '+point);let attempts = 0;
            const o = owner(() => {
                if (++attempts !== 1) return probe();
                if (point === 'factory') throw error;
                return probe({ [point]: error });
            });
            assert.equal((await start(o.flow)).ok, false);assert.equal(o.flow.snapshot.stage, 'idle');
            assert.equal(o.flow.snapshot.session, null);assert.equal(o.errors[0], error);
            if (point !== 'factory') assert.deepEqual(o.modules[0].calls.slice(-2), ['exit', 'dispose']);
            assert.equal((await start(o.flow)).ok, true);o.flow.exit();
        }
    });
    await check('pause/resume failures trigger cleanup and keep the error evidence', async () => {
        for (const point of ['pauseError', 'resumeError']) {
            const error = new Error('expected '+point);const o = owner(() => probe({ [point]: error }));
            await start(o.flow);o.flow.pause();if (point === 'resumeError') o.flow.resume();
            assert.equal(o.flow.snapshot.stage, 'idle');assert.equal(o.errors[0], error);
            assert.deepEqual(o.modules[0].calls.slice(-2), ['exit', 'dispose']);
        }
    });
    await check('failing exit still attempts dispose; unsafe cleanup quarantines further starts', async () => {
        const errors = [new Error('expected exit failure'), new Error('expected dispose failure')];
        const o = owner(() => probe({ exitError: errors[0], disposeError: errors[1] }));
        await start(o.flow);o.flow.exit();
        assert.deepEqual(o.modules[0].calls, ['load', 'enter', 'exit', 'dispose']);
        assert.deepEqual(o.errors, errors);assert.equal(o.flow.snapshot.stage, 'idle');
        assert.match(o.flow.snapshot.error, /重新预览/);assert.equal((await start(o.flow)).ok, false);
        assert.equal(o.modules.length, 1);
    });
    await check('owner disposal cancels loading and prevents any later enter', async () => {
        const wait = deferred(), instance = probe({ wait });const o = owner(() => instance);
        const pending = start(o.flow);o.flow.dispose();wait.resolve();
        assert.equal((await pending).ok, false);assert.equal(instance.token.cancelled, true);
        assert.equal(o.flow.snapshot.session, null);assert.deepEqual(instance.calls, ['load', 'exit', 'dispose']);
        assert.equal((await start(o.flow)).ok, false);
    });
    await check('cancel during the factory cleans the newly returned module without loading it', async () => {
        const instance = probe();let flow;
        flow = new GameFlow(new GameRegistry([{ id: 'fixture-a', modes: ['solo'], create() { flow.exit();return instance; } }]), () => {}, () => {});
        assert.equal((await start(flow, 'fixture-a')).ok, false);
        assert.deepEqual(instance.calls, ['exit', 'dispose']);assert.equal(flow.snapshot.stage, 'idle');
    });
    await check('counter ignores pre-enter/disposed input and target wraps deterministically', () => {
        const model = new CounterModel(Object.freeze({ sessionId: 'fixture', gameId: 'fixture-a', mode: 'solo', characterId: 'yier' }));
        assert.equal(model.hit(), false);model.enter();
        for (let i = 1; i <= 12; i++) { model.hit();assert.equal(model.target, i % 4); }
        model.dispose();model.dispose();assert.equal(model.hit(), false);assert.equal(model.count, 0);
    });
    await check('playfield hit areas are disjoint and contained at all required aspect ratios', () => {
        const boxes = [COUNTER_LAYOUT.player, ...COUNTER_LAYOUT.targets, ...COUNTER_LAYOUT.buttons];
        for (const b of boxes) { assert.ok(Math.abs(b.x)+b.width/2 < 640);assert.ok(Math.abs(b.y)+b.height/2 < 360); }
        for (let i=0;i<boxes.length;i++) for (let j=i+1;j<boxes.length;j++) {
            const a=boxes[i],b=boxes[j];
            assert.ok(Math.abs(a.x-b.x)>=(a.width+b.width)/2 || Math.abs(a.y-b.y)>=(a.height+b.height)/2);
        }
        for (const [width,height] of [[1280,720],[2160,1620],[840,360]]) {
            const {scale}=m.fitDesign(width,height);assert.ok(1280*scale<=width && 720*scale<=height);
        }
    });
    // F-01: resources are real owned handles, not just lifecycle call-count assertions.
    function resourceProbe(wait, loadError) {
        const instance = probe();
        instance.resources = [];
        instance.load = async function (session, token) {
            this.calls.push('load');this.model = new CounterModel(session);this.token = token;
            if (wait) await wait.promise;
            const resource = { sessionId: session.sessionId, alive: true, releases: 0 };
            this.resources.push(resource);
            const accepted = token.retain(() => {
                resource.releases++;assert.equal(resource.releases, 1, 'Each concrete handle is released once');
                resource.alive = false;
            });
            this.accepted = accepted;
            if (loadError) throw loadError;
            if (!accepted) return;
            assert.equal(resource.alive, true);
        };
        return instance;
    }
    await check('cancelled load creates a late resource then resolves/rejects: release it without touching the new session', async () => {
        for (const fails of [false, true]) {
            const wait = deferred(), error = fails ? new Error('expected failure after late allocation') : undefined;
            const stale = resourceProbe(wait, error), next = resourceProbe();let calls = 0;
            const o = owner(() => ++calls === 1 ? stale : next);
            const pending = start(o.flow, DEVELOPMENT_GAME_ID, 'yier');
            assert.equal(stale.resources.length, 0);
            o.flow.exit();assert.equal(stale.token.cancelled, true);
            assert.deepEqual(stale.calls, ['load', 'exit', 'dispose']);
            assert.equal((await start(o.flow, DEVELOPMENT_GAME_ID, 'bubu')).ok, true);
            const current = o.flow.snapshot, stateCount = o.states.length, active = next.resources[0];
            assert.equal(active.alive, true);assert.equal(active.releases, 0);
            wait.resolve();assert.equal((await pending).ok, false);
            assert.equal(stale.resources.length, 1, 'The resource really is created after cancellation');
            assert.equal(stale.accepted, false);
            assert.equal(stale.resources[0].alive, false);assert.equal(stale.resources[0].releases, 1);
            assert.deepEqual(stale.calls, ['load', 'exit', 'dispose'], 'No second module lifecycle or enter');
            assert.equal(o.flow.snapshot, current);assert.equal(o.states.length, stateCount);
            assert.equal(current.session.characterId, 'bubu');
            assert.notEqual(active.sessionId, stale.resources[0].sessionId);
            assert.equal(active.alive, true);assert.equal(active.releases, 0);
            assert.deepEqual(o.errors, fails ? [error] : []);
            o.flow.exit();assert.equal(active.alive, false);assert.equal(active.releases, 1);
        }
    });
    await check('disposing the owner while loading still releases later acquisitions and never enters', async () => {
        const wait = deferred(), instance = resourceProbe(wait), o = owner(() => instance);
        const pending = start(o.flow);o.flow.dispose();o.flow.dispose();
        assert.equal(instance.resources.length, 0);wait.resolve();
        assert.equal((await pending).ok, false);
        assert.equal(instance.resources[0].alive, false);assert.equal(instance.resources[0].releases, 1);
        assert.deepEqual(instance.calls, ['load', 'exit', 'dispose']);
        assert.equal(o.flow.snapshot.stage, 'idle');assert.equal(o.flow.snapshot.session, null);
        assert.equal((await start(o.flow)).ok, false);assert.deepEqual(o.errors, []);
    });
    await check('registered resources release on normal exit/failure and one release error does not skip the others', async () => {
        for (const fails of [false, true]) {
            const error = fails ? new Error('expected load failure after acquisition') : undefined;
            const instance = resourceProbe(undefined, error), o = owner(() => instance);
            assert.equal((await start(o.flow)).ok, !fails);
            const resource = instance.resources[0];
            assert.equal(resource.alive, !fails);assert.equal(instance.accepted, true);
            o.flow.exit();o.flow.exit();o.flow.dispose();
            assert.equal(resource.alive, false);assert.equal(resource.releases, 1);
            assert.deepEqual(o.errors, fails ? [error] : []);
        }
        const instance = resourceProbe(), o = owner(() => instance);
        await start(o.flow);
        const error = new Error('expected resource release failure'), calls = [];
        instance.token.retain(() => calls.push('first'));
        instance.token.retain(() => { calls.push('second');throw error; });
        instance.token.retain(() => calls.push('third'));
        o.flow.exit();
        assert.deepEqual(calls, ['third', 'second', 'first']);
        assert.equal(instance.resources[0].alive, false);assert.equal(instance.resources[0].releases, 1);
        assert.deepEqual(o.errors, [error]);assert.match(o.flow.snapshot.error, /重新预览/);
        assert.equal((await start(o.flow)).ok, false);assert.equal(o.modules.length, 1);
    });
    console.log(`Game lifecycle: ${count} checks passed. No Cocos, GUI or rendering executed.`);
}
main().catch(error => { console.error(error);process.exitCode = 1; });
