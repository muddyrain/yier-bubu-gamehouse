import { isCharacterId } from './LobbyModel';
import type { CharacterChoice, CharacterId } from './LobbyModel';

/** Runtime registry IDs; the four public catalog IDs remain unchanged in LobbyModel. */
export type GameId = string;
export type GameMode = 'solo' | 'coop' | 'versus';
export const DEVELOPMENT_GAME_ID: GameId = 'development-counter';
export interface GameSession {
    readonly sessionId: string;
    readonly gameId: GameId;
    readonly mode: GameMode;
    readonly characterId: CharacterId;
}
export interface LoadCancellation {
    readonly cancelled: boolean;
    /**
     * Register each acquired resource immediately, including after every await.
     * true: this load owns it until exit; false: already cancelled and release attempted.
     * On false, stop using the resource. Capture the concrete handle, never the current session.
     * Registered resources must not also be released by module exit/dispose.
     */
    retain(release: () => void): boolean;
}
export interface GameModule {
    /** Every async acquisition must follow LoadCancellation.retain; synchronous resources remain module-owned. */
    load(session: GameSession, cancellation: LoadCancellation): void | Promise<void>;
    enter(): void;
    pause(): void;
    resume(): void;
    exit(): void;
    dispose(): void;
}
export interface GameRegistration {
    readonly id: GameId;
    readonly modes: readonly GameMode[];
    readonly create: () => GameModule;
}

export class GameRegistry {
    private readonly entries = new Map<GameId, GameRegistration>();

    public constructor(entries: readonly GameRegistration[]) {
        for (const entry of entries) {
            if (!/^[a-z][a-z0-9-]*$/.test(entry.id) || this.entries.has(entry.id)
                || entry.modes.length === 0 || entry.modes.some(mode => ['solo', 'coop', 'versus'].indexOf(mode) < 0)) {
                throw new Error('Invalid or duplicate game registration');
            }
            this.entries.set(entry.id, Object.freeze({ ...entry, modes: Object.freeze([...entry.modes]) }));
        }
    }

    public find(id: unknown): GameRegistration | undefined {
        return typeof id === 'string' ? this.entries.get(id) : undefined;
    }
}

export type FlowStage = 'idle' | 'loading' | 'running' | 'paused' | 'exiting';
export interface FlowSnapshot {
    readonly stage: FlowStage;
    readonly session: GameSession | null;
    readonly error: string | null;
}
export interface StartResult { readonly ok: boolean; readonly error: string | null }
interface OwnedModule {
    readonly session: GameSession;
    readonly cancellation: LoadResources;
    module: GameModule | null;
    cleaned: boolean;
}

/** A per-load scope stays closed to late acquisitions even after module exit/dispose. */
class LoadResources implements LoadCancellation {
    private closed = false;
    private failed = false;
    private readonly releases: (() => void)[] = [];

    public constructor(private readonly reportError: (error: unknown) => void) {}

    public get cancelled(): boolean { return this.closed; }

    public retain(release: () => void): boolean {
        if (this.closed) {
            this.release(release);
            return false;
        }
        this.releases.push(release);
        return true;
    }

    public cancel(): void { this.closed = true; }

    public dispose(): boolean {
        this.cancel();
        const releases = this.releases.splice(0);
        for (const release of releases.reverse()) this.release(release);
        return this.failed;
    }

    private release(release: () => void): void {
        try { release(); }
        catch (error) { this.failed = true; this.reportError(error); }
    }
}

/** One owner per Lobby instance. No engine, global session, timer, storage or network. */
export class GameFlow {
    private current: OwnedModule | null = null;
    private serial = 0;
    private disposed = false;
    private value: FlowSnapshot = Object.freeze({ stage: 'idle', session: null, error: null });

    public constructor(private readonly registry: GameRegistry,
        private readonly changed: (state: FlowSnapshot) => void,
        private readonly reportError: (error: unknown) => void) {}

    public get snapshot(): FlowSnapshot { return this.value; }

    public async start(gameId: unknown, mode: unknown, choice: CharacterChoice | null): Promise<StartResult> {
        if (this.disposed) return { ok: false, error: '测试入口已关闭。' };
        if (this.current) return { ok: false, error: '正在进入或运行测试，请先返回大厅。' };
        const entry = this.registry.find(gameId);
        if (!entry) return this.reject('该测试模块不存在，请返回大厅。');
        if (mode !== 'solo' && mode !== 'coop' && mode !== 'versus') return this.reject('不支持的游戏模式。');
        if (entry.modes.indexOf(mode) < 0) return this.reject('该模块尚不支持此模式。');
        const characterId = choice?.characterId;
        if (!isCharacterId(characterId)) return this.reject('请先在大厅确认一二或布布。');
        // Copy before leaving Lobby. Never retain CharacterChoice or a Component reference.
        const session: GameSession = Object.freeze({ sessionId: `local-${++this.serial}`, gameId: entry.id,
            mode, characterId });
        const owned: OwnedModule = { session, cancellation: new LoadResources(this.reportError), module: null, cleaned: false };
        this.current = owned;
        this.publish('loading', session, null);
        try {
            owned.module = entry.create();
            // A synchronous factory can cancel the request; do not start its load afterwards.
            if (this.current !== owned) {
                this.cleanup(owned);
                return { ok: false, error: '本次进入已取消。' };
            }
            await owned.module.load(session, owned.cancellation);
            if (this.current !== owned || owned.cancellation.cancelled) return { ok: false, error: '本次进入已取消。' };
            owned.module.enter();
            if (this.current !== owned) return { ok: false, error: '本次进入已取消。' };
            this.publish('running', session, null);
            return { ok: true, error: null };
        } catch (error) {
            this.reportError(error);
            // Late failures belong to the cancelled request, never the next active session.
            if (this.current === owned) this.finish(owned, '测试模块启动失败，请重试或返回大厅。');
            return { ok: false, error: '测试模块启动失败，请重试或返回大厅。' };
        }
    }

    public pause(): void { this.changeActivity('running', 'paused', 'pause'); }
    public resume(): void { this.changeActivity('paused', 'running', 'resume'); }

    public exit(): void {
        if (this.current && this.value.stage !== 'exiting') this.finish(this.current, null);
    }

    public dispose(): void {
        this.disposed = true;
        this.exit();
    }

    private reject(error: string): StartResult {
        this.publish('idle', null, error);
        return { ok: false, error };
    }

    private changeActivity(from: FlowStage, to: FlowStage, action: 'pause' | 'resume'): void {
        const owned = this.current;
        if (!owned || this.value.stage !== from || !owned.module) return;
        try {
            owned.module[action]();
            if (this.current === owned) this.publish(to, owned.session, null);
        } catch (error) {
            this.reportError(error);
            if (this.current === owned) this.finish(owned, '测试已安全中止，请重新进入。');
        }
    }

    private finish(owned: OwnedModule, error: string | null): void {
        owned.cancellation.cancel();
        this.publish('exiting', owned.session, error);
        const cleanupFailed = this.cleanup(owned);
        if (this.current === owned) {
            this.current = null;
            // An adapter that could not dispose must not overlap a replacement module.
            if (cleanupFailed) this.disposed = true;
            this.publish('idle', null, cleanupFailed ? '退出清理出现异常，详情已记录。请重新预览。' : error);
        }
    }

    private cleanup(owned: OwnedModule): boolean {
        let failed = false;
        if (owned.module && !owned.cleaned) {
            owned.cleaned = true;
            for (const action of ['exit', 'dispose'] as const) {
                try { owned.module[action](); }
                catch (error) { failed = true; this.reportError(error); }
            }
        }
        return owned.cancellation.dispose() || failed;
    }

    private publish(stage: FlowStage, session: GameSession | null, error: string | null): void {
        this.value = Object.freeze({ stage, session, error });
        this.changed(this.value);
    }
}
