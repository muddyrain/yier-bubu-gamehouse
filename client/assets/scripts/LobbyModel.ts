/** Engine-free P1-02 catalog and navigation. No game sessions, storage, or networking. */
export type GameId = 'tower-defense' | 'gold-miner' | 'merge' | 'snake';
export interface GameCatalogEntry {
    readonly id: GameId;
    readonly name: string;
    readonly summary: string;
    readonly category: string;
    readonly color: string;
    readonly status: 'coming-soon';
}

export const GAMES: readonly GameCatalogEntry[] = Object.freeze([
    Object.freeze({ id: 'tower-defense', name: '一二布布守护小屋', summary: '一起守护，迎接每一波挑战', category: '主游戏 · 策略闯关', color: '#4B775F', status: 'coming-soon' }),
    Object.freeze({ id: 'gold-miner', name: '一二布布黄金矿工', summary: '瞄准宝藏，收获挖矿乐趣', category: '经典 · 抓钩挑战', color: '#94672B', status: 'coming-soon' }),
    Object.freeze({ id: 'merge', name: '一二布布合成乐园', summary: '碰出惊喜，发现新的合成', category: '经典 · 合成探索', color: '#A95870', status: 'coming-soon' }),
    Object.freeze({ id: 'snake', name: '一二布布贪吃蛇', summary: '灵巧转向，挑战更长记录', category: '经典 · 灵巧挑战', color: '#4D7294', status: 'coming-soon' }),
]);

export const CHARACTERS = Object.freeze([
    Object.freeze({ id: 'yier', name: '一二', identity: '小白熊', color: '#FFF9EF' }),
    Object.freeze({ id: 'bubu', name: '布布', identity: '小棕熊', color: '#B67B55' }),
]);
export const CONTINUE_AVAILABLE = false;
export const STATUS_TEXT = Object.freeze({ 'coming-soon': '开发中' });
export const DESIGN = Object.freeze({ width: 1280, height: 720 });
export interface Box { readonly x: number; readonly y: number; readonly width: number; readonly height: number }

// Center-anchored reference units, fitted uniformly as a whole, never physical screen pixels.
// Card positions are a two-column / two-row flow within the right-hand catalog region.
export const LAYOUT = Object.freeze({
    hero: Object.freeze({ x: -414, y: -18, width: 356, height: 432 }),
    avatars: Object.freeze([-82, 82].map(x => Object.freeze({ x, y: 62, width: 136, height: 136 }))),
    cards: Object.freeze(Array.from({ length: 4 }, (_, i) => Object.freeze({
        x: 32 + (i % 2) * 368, y: 80 - Math.floor(i / 2) * 208, width: 344, height: 180,
    }))),
    toolbar: Object.freeze([410, 528].map(x => Object.freeze({ x, y: 282, width: 104, height: 48 }))),
});

export function fitDesign(width: number, height: number): { scale: number; paddingX: number; paddingY: number } {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
        throw new Error('A positive viewport is required');
    }
    const scale = Math.min(width / DESIGN.width, height / DESIGN.height);
    return { scale, paddingX: (width - DESIGN.width * scale) / 2, paddingY: (height - DESIGN.height * scale) / 2 };
}

export type Navigation = { readonly kind: 'home' } | { readonly kind: 'notice'; readonly title: string; readonly body: string };
export type LobbyAction = { readonly type: 'game'; readonly gameId: string } | { readonly type: 'help' | 'settings' | 'friends' | 'close' };
export const HOME: Navigation = Object.freeze({ kind: 'home' });

export function navigate(state: Navigation, action: LobbyAction): Navigation {
    if (action.type === 'close') return HOME;
    // Only the top panel receives input; repeated open requests cannot grow a stack.
    if (state.kind !== 'home') return state;
    switch (action.type) {
        case 'game': {
            const game = GAMES.find(entry => entry.id === action.gameId);
            return game
                ? { kind: 'notice', title: game.name, body: `${game.summary}\n\n开发中 · 尚未开放\n当前只能查看介绍，暂不提供游戏或选角。` }
                : { kind: 'notice', title: '内容暂不可用', body: '该游戏入口不存在。\n请返回大厅查看当前目录。' };
        }
        case 'friends':
            return { kind: 'notice', title: '好友一起玩 · 敬请期待', body: '好友模式尚未开放。\n本轮不提供房间、分享、微信登录或联机选角。\n后续开放时，会在这里提供明确入口。' };
        case 'settings':
            return { kind: 'notice', title: '设置说明', body: '当前使用原创程序几何占位。\n本版本没有音乐、音效，暂无可调整项。\n正式设置随相应功能一起开放。' };
        case 'help':
            return { kind: 'notice', title: '欢迎来到游戏屋', body: '一二是小白熊，布布是小棕熊。\n点击任意游戏卡查看介绍，四款均在开发中。\n关闭提示即可回到大厅。\n键盘：Tab / 方向键切换，Enter 确认，Esc 返回。' };
    }
}

export function moveFocus(current: number, count: number, direction: number): number {
    return count > 0 ? ((current + direction) % count + count) % count : 0;
}
