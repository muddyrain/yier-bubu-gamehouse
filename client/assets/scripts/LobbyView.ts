import {
    _decorator, BlockInputEvents, Button, Color, Component, EventKeyboard, Graphics,
    input, Input, isValid, KeyCode, Label, Node, UITransform,
} from 'cc';
import {
    CHARACTERS, DESIGN, GAMES, INITIAL_LOBBY, LAYOUT, SELECTION_LAYOUT, STATUS_TEXT,
    characterStatus, fitDesign, moveFocus, transitionLobby,
} from './LobbyModel';
import type { AppAction, Box, CharacterChoice, CharacterEntry, LobbyState } from './LobbyModel';
import { DEVELOPMENT_GAME_ID, GameFlow, GameRegistry } from './GameLifecycle';
import type { FlowSnapshot } from './GameLifecycle';
import { DevelopmentModule } from './DevelopmentModule';
import { characterVisuals } from './CharacterVisual';

const { ccclass } = _decorator;
const INK = '#40382F';
const MUTED = '#74685B';
const PAPER = '#FFFCF6';
const ACCENT = '#4B775F';

type ViewAction = AppAction | { readonly type: 'development-test' };
interface Control {
    readonly node: Node;
    readonly graphics: Graphics;
    readonly button: Button;
    readonly action: ViewAction;
    readonly fill: string;
    readonly box: Box;
    readonly click: () => void;
}

/** Lobby UI and local preference owner. Startup remains the unchanged P1-01 runtime probe. */
@ccclass('LobbyView')
export class LobbyView extends Component {
    private root!: Node;
    private overlay!: Node;
    private modalTitle!: Label;
    private modalBody!: Label;
    private noticePanel!: Node;
    private characterPanel!: Node;
    private characterMessage!: Label;
    private characterEntry!: Control;
    private characterEntryLabel!: Label;
    private readonly characterCards: Control[] = [];
    private readonly selectedLabels: Label[] = [];
    private characterBack!: Control;
    private confirmCharacter!: Control;
    private reselect!: Control;
    private readonly controls: Control[] = [];
    private readonly homeControls: Control[] = [];
    private back!: Control;
    private state: LobbyState = INITIAL_LOBBY;
    private focusIndex = 0;
    private panelFocusIndex = 0;
    private gameFlow!: GameFlow;
    private launchStatus!: Label;

    /** Immutable preference copied into each GameSession; never a saved profile. */
    public getConfirmedCharacter(): CharacterChoice | null {
        return this.state.choice;
    }

    protected onLoad(): void {
        this.root = this.nodeBox(this.node, 'LobbyRoot', { x: 0, y: 0, ...DESIGN });
        const background = this.root.addComponent(Graphics);
        background.fillColor = Color.fromHEX(new Color(), '#F8F3E8');
        background.rect(-640, -360, 1280, 720);
        background.fill();
        this.label(this.root, 'GAMEHOUSE / 一起发现小乐趣', -192, 320, 800, 26, 16, MUTED, true);
        this.label(this.root, '一二布布游戏屋', -192, 278, 800, 52, 38, INK, true);
        this.label(this.root, '两位好朋友，四种期待。慢慢玩，常常见。', -192, 236, 800, 28, 19, MUTED, true);
        this.createHero();
        this.label(this.root, '来挑一份期待', 216, 202, 712, 30, 22, INK, true);
        GAMES.forEach((game, index) => {
            const control = this.control(this.root, `Game-${game.id}`, LAYOUT.cards[index],
                { type: 'game', gameId: game.id }, PAPER);
            this.homeControls.push(control);
            this.label(control.node, `0${index + 1} / ${game.category}`, -40, 60, 216, 26, 16, game.color, true);
            this.label(control.node, STATUS_TEXT[game.status], 116, 60, 76, 28, 18, game.color);
            this.label(control.node, game.name, 0, 17, 304, 38, 25, INK, true);
            this.label(control.node, game.summary, 0, -23, 304, 28, 18, MUTED, true);
            this.label(control.node, '查看介绍  →', 0, -60, 304, 28, 18, game.color, true);
        });
        for (const [index, type] of (['help', 'settings'] as const).entries()) {
            const item = this.control(this.root, type, LAYOUT.toolbar[index], { type }, '#EDE5D9');
            this.homeControls.push(item);
            this.label(item.node, type === 'help' ? '帮助' : '设置', 0, 0, 92, 38, 20, INK);
        }
        // Keep the original seven controls' keyboard order; append the new entry.
        this.homeControls.push(this.characterEntry);
        const test = this.control(this.root, 'DevelopmentEntry', { x: -176, y: -282, width: 760, height: 48 },
            { type: 'development-test' }, '#D8E4D9');
        this.homeControls.push(test);
        this.label(test.node, '开发测试 · 进入操作场（先确认角色）', 0, 0, 736, 38, 21, INK);
        this.label(this.root, '四款正式游戏开发中\n暂无可继续的存档', 420, -282, 320, 54, 18, MUTED);
        this.launchStatus = this.label(this.root, '开发验证 / 非正式游戏 · 使用既有原创几何占位', 0, -329, 1160, 26, 17, MUTED);
        this.createNotice();
        this.createCharacterSelection();
        this.gameFlow = new GameFlow(new GameRegistry([{ id: DEVELOPMENT_GAME_ID, modes: ['solo'],
            create: () => new DevelopmentModule(this.node, { pause: () => this.gameFlow.pause(),
                resume: () => this.gameFlow.resume(), exit: () => this.gameFlow.exit() }) }]),
        state => this.onGameState(state), error => console.error('[P1-04] lifecycle error', error));
    }

    protected onEnable(): void {
        this.root.active = true;
        this.launchStatus.string = this.gameFlow.snapshot.error ?? '开发验证 / 非正式游戏 · 使用既有原创几何占位';
        for (const control of this.controls) control.node.on(Button.EventType.CLICK, control.click, this);
        this.node.on(Node.EventType.SIZE_CHANGED, this.fit, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.fit();
        this.render();
        console.info('[P1-02] Lobby enabled: 4 coming-soon games, yier + bubu.');
    }

    protected onDisable(): void {
        this.gameFlow?.exit();
        for (const control of this.controls) control.node.off(Button.EventType.CLICK, control.click, this);
        this.node.off(Node.EventType.SIZE_CHANGED, this.fit, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.state = transitionLobby(this.state, { type: 'close' });
        this.panelFocusIndex = 0;
        this.root.active = false;
    }

    protected onDestroy(): void {
        this.gameFlow?.dispose();
        // Scene teardown may have already destroyed this owned child.
        if (isValid(this.root, true)) this.root.destroy();
    }

    private fit(): void {
        const size = this.node.getComponent(UITransform)!.contentSize;
        if (size.width <= 0 || size.height <= 0) return;
        const { scale } = fitDesign(size.width, size.height);
        this.root.setScale(scale, scale, 1);
        this.root.setPosition(0, 0, 0);
    }

    private createHero(): void {
        const hero = this.nodeBox(this.root, 'Protagonists', LAYOUT.hero);
        this.paint(hero.addComponent(Graphics), LAYOUT.hero, '#EEE4D4', false);
        this.label(hero, '一二 & 布布', 0, 175, 320, 38, 26, INK);
        this.label(hero, '两位主角，同样重要', 0, 140, 320, 26, 18, MUTED);
        CHARACTERS.forEach((character, index) => {
            this.bear(hero, character, LAYOUT.avatars[index]);
            this.label(hero, character.name, LAYOUT.avatars[index].x, -38, 140, 36, 26, INK);
            this.label(hero, character.identity, LAYOUT.avatars[index].x, -73, 140, 26, 18, MUTED);
        });
        this.characterEntry = this.control(hero, 'ChooseCharacter', { x: 0, y: -116, width: 292, height: 48 }, { type: 'characters' }, '#D8E4D9');
        this.characterEntryLabel = this.label(this.characterEntry.node, '选择角色', 0, 0, 276, 38, 21, INK);
        const friends = this.control(hero, 'Friends', { x: 0, y: -174, width: 292, height: 48 }, { type: 'friends' }, '#D8E4D9');
        this.homeControls.push(friends);
        this.label(friends.node, '好友一起玩 · 敬请期待', 0, 0, 276, 40, 20, INK);
    }

    private bear(parent: Node, character: CharacterEntry, box: Box): void {
        characterVisuals.create(parent, character.id, box);
    }

    private createNotice(): void {
        this.overlay = this.nodeBox(this.root, 'NoticeOverlay', { x: 0, y: 0, ...DESIGN });
        this.overlay.addComponent(BlockInputEvents);
        const shade = this.overlay.addComponent(Graphics);
        shade.fillColor = new Color(40, 34, 27, 205);
        shade.rect(-640, -360, 1280, 720);
        shade.fill();
        const panelBox = { x: 0, y: 0, width: 720, height: 440 };
        const panel = this.nodeBox(this.overlay, 'NoticePanel', panelBox);
        this.noticePanel = panel;
        this.paint(panel.addComponent(Graphics), panelBox, PAPER, false);
        this.modalTitle = this.label(panel, '', 0, 142, 656, 60, 28, INK);
        this.modalBody = this.label(panel, '', 0, 24, 640, 172, 22, MUTED);
        this.back = this.control(panel, 'BackToLobby', { x: 0, y: -146, width: 224, height: 56 }, { type: 'close' }, '#D8E4D9');
        this.label(this.back.node, '返回大厅', 0, 0, 208, 40, 22, INK);
    }

    private createCharacterSelection(): void {
        const panel = this.nodeBox(this.overlay, 'CharacterPanel', SELECTION_LAYOUT.panel);
        this.characterPanel = panel;
        this.paint(panel.addComponent(Graphics), SELECTION_LAYOUT.panel, PAPER, false);
        this.label(panel, '选择你的主角', 0, 264, 880, 48, 30, INK);
        this.label(panel, '一二与布布，同样重要 · 仅设置本次大厅偏好', 0, 220, 880, 32, 20, MUTED);
        CHARACTERS.forEach((character, index) => {
            const card = this.control(panel, `Choose-${character.id}`, SELECTION_LAYOUT.cards[index],
                { type: 'choose-character', characterId: character.id }, '#EEE4D4');
            this.characterCards.push(card);
            this.bear(card.node, character, { x: 0, y: 40, width: 136, height: 136 });
            this.label(card.node, character.name, 0, -54, 320, 40, 28, INK);
            this.label(card.node, character.identity, 0, -93, 320, 28, 20, MUTED);
            this.selectedLabels.push(this.label(card.node, '', 0, -124, 320, 26, 18, ACCENT));
        });
        this.characterMessage = this.label(panel, '', 0, -156, 920, 64, 20, INK);
        this.characterBack = this.control(panel, 'CancelCharacter', SELECTION_LAYOUT.buttons[0], { type: 'close' }, '#EDE5D9');
        this.label(this.characterBack.node, '返回大厅', 0, 0, 184, 40, 22, INK);
        this.confirmCharacter = this.control(panel, 'ConfirmCharacter', SELECTION_LAYOUT.buttons[1], { type: 'confirm-character' }, '#D8E4D9');
        this.label(this.confirmCharacter.node, '确认选择', 0, 0, 184, 40, 22, INK);
        this.reselect = this.control(panel, 'ReselectCharacter', SELECTION_LAYOUT.buttons[2], { type: 'reselect' }, '#D8E4D9');
        this.label(this.reselect.node, '再次选择', 0, 0, 184, 40, 22, INK);
    }

    private dispatch(action: ViewAction): void {
        if (this.gameFlow.snapshot.stage !== 'idle') return;
        if (action.type === 'development-test') {
            if (this.state.screen.kind === 'home') void this.gameFlow.start(DEVELOPMENT_GAME_ID, 'solo', this.getConfirmedCharacter());
            return;
        }
        const previous = this.state.screen;
        this.state = transitionLobby(this.state, action);
        const next = this.state.screen;
        if (previous.kind !== next.kind || (previous.kind === 'characters' && next.kind === 'characters' && previous.phase !== next.phase)) {
            this.panelFocusIndex = 0;
        }
        this.render();
    }

    private onGameState(state: FlowSnapshot): void {
        console.info('[P1-04] lifecycle', state.stage, state.session?.sessionId ?? 'none');
        if (!this.enabledInHierarchy) return;
        this.root.active = state.stage === 'idle' || state.stage === 'loading';
        this.launchStatus.string = state.error ?? (state.stage === 'loading' ? '正在进入开发测试 · Esc 可取消'
            : '开发验证 / 非正式游戏 · 使用既有原创几何占位');
        this.render();
    }

    private render(): void {
        const screen = this.state.screen;
        const open = screen.kind !== 'home';
        this.overlay.active = open;
        this.noticePanel.active = screen.kind === 'notice';
        this.characterPanel.active = screen.kind === 'characters';
        const available = this.gameFlow.snapshot.stage === 'idle';
        for (const control of this.homeControls) control.button.interactable = !open && available;
        this.back.button.interactable = screen.kind === 'notice';
        const choosing = screen.kind === 'characters' && screen.phase === 'choosing';
        this.characterBack.button.interactable = screen.kind === 'characters';
        this.confirmCharacter.button.interactable = choosing && screen.draft !== null;
        this.reselect.node.active = screen.kind === 'characters' && screen.phase === 'confirmed';
        this.reselect.button.interactable = this.reselect.node.active;
        this.characterCards.forEach((control, index) => {
            control.button.interactable = choosing;
            const selected = screen.kind === 'characters' && screen.draft === CHARACTERS[index].id;
            this.selectedLabels[index].string = selected ? (choosing ? '已选' : '已确认') : choosing ? '点击选择' : '未选择';
        });
        if (screen.kind === 'notice') {
            this.modalTitle.string = screen.title;
            this.modalBody.string = screen.body;
        } else if (screen.kind === 'characters') {
            this.characterMessage.string = characterStatus(screen);
        }
        const character = CHARACTERS.find(entry => entry.id === this.state.choice?.characterId);
        this.characterEntryLabel.string = character ? `角色：${character.name} · 更改` : '选择角色';
        const active = this.activeControls();
        if (this.panelFocusIndex >= active.length) this.panelFocusIndex = 0;
        const focused = active[open ? this.panelFocusIndex : this.focusIndex];
        for (const control of this.controls) {
            const selected = screen.kind === 'characters' && control.action.type === 'choose-character' && control.action.characterId === screen.draft;
            const fill = selected ? '#E2EEDD' : control.button.interactable ? control.fill : '#EEEAE3';
            this.paint(control.graphics, control.box, fill, control === focused);
        }
    }

    private activeControls(): Control[] {
        if (this.gameFlow?.snapshot.stage !== 'idle') return [];
        if (this.state.screen.kind === 'home') return this.homeControls;
        if (this.state.screen.kind === 'notice') return [this.back];
        // Neutral initial focus on Back. Disabled/hidden controls cannot receive keyboard input.
        return [this.characterBack, ...this.characterCards, this.confirmCharacter, this.reselect]
            .filter(control => control.node.active && control.button.interactable);
    }

    private onKeyDown(event: EventKeyboard): void {
        if (this.gameFlow.snapshot.stage !== 'idle') {
            if (this.gameFlow.snapshot.stage === 'loading' && event.keyCode === KeyCode.ESCAPE) this.gameFlow.exit();
            return;
        }
        if (event.keyCode === KeyCode.ESCAPE) {
            this.dispatch({ type: 'close' });
            return;
        }
        const forward = [KeyCode.TAB, KeyCode.ARROW_RIGHT, KeyCode.ARROW_DOWN].indexOf(event.keyCode) >= 0;
        const backward = [KeyCode.ARROW_LEFT, KeyCode.ARROW_UP].indexOf(event.keyCode) >= 0;
        const active = this.activeControls();
        if (forward || backward) {
            if (this.state.screen.kind === 'home') this.focusIndex = moveFocus(this.focusIndex, active.length, backward ? -1 : 1);
            else this.panelFocusIndex = moveFocus(this.panelFocusIndex, active.length, backward ? -1 : 1);
            this.render();
        } else if (event.keyCode === KeyCode.ENTER || event.keyCode === KeyCode.SPACE) {
            const control = active[this.state.screen.kind === 'home' ? this.focusIndex : this.panelFocusIndex];
            if (control) this.dispatch(control.action);
        }
    }

    private nodeBox(parent: Node, name: string, box: Box): Node {
        const node = new Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        node.addComponent(UITransform).setContentSize(box.width, box.height);
        node.setPosition(box.x, box.y, 0);
        return node;
    }

    private label(parent: Node, text: string, x: number, y: number, width: number, height: number,
        fontSize: number, color: string, left = false): Label {
        const node = this.nodeBox(parent, 'Text', { x, y, width, height });
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 8;
        label.horizontalAlign = left ? Label.HorizontalAlign.LEFT : Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.color = Color.fromHEX(new Color(), color);
        return label;
    }

    private control(parent: Node, name: string, box: Box, action: ViewAction, fill: string): Control {
        const node = this.nodeBox(parent, name, box);
        const graphics = node.addComponent(Graphics);
        const button = node.addComponent(Button);
        button.transition = Button.Transition.NONE;
        const control: Control = { node, graphics, button, action, fill, box, click: () => {
            const index = this.activeControls().indexOf(control);
            if (index < 0) return;
            if (this.state.screen.kind === 'home') this.focusIndex = index;
            else this.panelFocusIndex = index;
            this.dispatch(action);
        } };
        this.controls.push(control);
        this.paint(graphics, box, fill, false);
        return control;
    }

    private paint(graphics: Graphics, box: Box, fill: string, focused: boolean): void {
        graphics.clear();
        graphics.fillColor = Color.fromHEX(new Color(), fill);
        graphics.strokeColor = Color.fromHEX(new Color(), focused ? ACCENT : '#DDD2C3');
        graphics.lineWidth = focused ? 4 : 1;
        graphics.roundRect(-box.width / 2 + 3, -box.height / 2 + 3, box.width - 6, box.height - 6, 18);
        graphics.fill();
        graphics.stroke();
    }
}
