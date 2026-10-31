import type { GameSession } from './GameLifecycle';

export const COUNTER_LAYOUT = Object.freeze({
    player: Object.freeze({ x: -402, y: 48, width: 136, height: 136 }),
    targets: Object.freeze(Array.from({ length: 4 }, (_, i) => Object.freeze({ x: -32 + (i % 2) * 384,
        y: 112 - Math.floor(i / 2) * 192, width: 208, height: 112 }))),
    buttons: Object.freeze([-156, 156].map(x => Object.freeze({ x, y: -264, width: 256, height: 56 }))),
});

/** Real counter rules shared by the Cocos module and CLI tests. Fresh object per session. */
export class CounterModel {
    private value = 0;
    private phase: 'ready' | 'running' | 'paused' | 'disposed' = 'ready';

    public constructor(public readonly session: GameSession) {}
    public get count(): number { return this.value; }
    public get target(): number { return this.value % COUNTER_LAYOUT.targets.length; }
    public get status(): string { return this.phase; }
    public enter(): void { if (this.phase === 'ready') this.phase = 'running'; }
    public pause(): void { if (this.phase === 'running') this.phase = 'paused'; }
    public resume(): void { if (this.phase === 'paused') this.phase = 'running'; }
    public hit(): boolean {
        if (this.phase !== 'running') return false;
        this.value += 1;
        return true;
    }
    public dispose(): void { this.phase = 'disposed'; this.value = 0; }
}
