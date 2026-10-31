import { BlockInputEvents, Button, Color, EventKeyboard, Graphics, input, Input,
    isValid, KeyCode, Label, Node, UITransform } from 'cc';
import { CHARACTERS, DESIGN, fitDesign, moveFocus } from './LobbyModel';
import type { Box } from './LobbyModel';
import type { GameModule, GameSession, LoadCancellation } from './GameLifecycle';
import { COUNTER_LAYOUT, CounterModel } from './CounterModel';
import { characterVisuals } from './CharacterVisual';

type Action = 'hit' | 'pause' | 'resume' | 'exit';
interface Control {
    readonly node: Node;
    readonly button: Button;
    readonly pen: Graphics;
    readonly box: Box;
    readonly action: Action;
    readonly phase: 'running' | 'paused';
    readonly click: () => void;
}
interface Requests { readonly pause: () => void; readonly resume: () => void; readonly exit: () => void }

/** A real, separately owned runtime playfield. No serialized scene, timer or asset download. */
export class DevelopmentModule implements GameModule {
    private root: Node | null = null;
    private model: CounterModel | null = null;
    private readonly controls: Control[] = [];
    private target!: Control;
    private countLabel!: Label;
    private pauseOverlay!: Node;
    private focus = 0;
    private subscribed = false;

    public constructor(private readonly parent: Node, private readonly requests: Requests) {}

    public load(session: GameSession, cancellation: LoadCancellation): void {
        if (cancellation.cancelled) return;
        if (this.root || this.model) throw new Error('Test module must be loaded only once');
        this.model = new CounterModel(session);
        this.root = this.node(this.parent, 'DevelopmentCounterModule', { x: 0, y: 0, ...DESIGN });
        this.root.active = false;
        this.fill(this.root, { x: 0, y: 0, ...DESIGN }, '#F8F3E8');
        this.label(this.root, '开发测试 · 目标操作场', 0, 314, 1120, 48, 32);
        this.label(this.root, '非正式游戏 · 不计奖励或存档 · 四款正式游戏仍在开发中', 0, 267, 1120, 30, 19);
        this.fill(this.root, { x: 0, y: 8, width: 1168, height: 440 }, '#EEE4D4');
        characterVisuals.create(this.root, session.characterId, COUNTER_LAYOUT.player);
        const character = CHARACTERS.find(entry => entry.id === session.characterId)!;
        this.label(this.root, `${character.name} · ${character.identity}`, -402, -70, 280, 40, 26);
        this.label(this.root, `ID：${session.characterId}`, -402, -114, 280, 30, 18);
        this.countLabel = this.label(this.root, '本局命中：0', 160, 206, 680, 40, 26);
        this.target = this.control(this.root, 'MovingTarget', COUNTER_LAYOUT.targets[0], '点亮目标 +1', 'hit', 'running');
        this.control(this.root, 'PauseTest', COUNTER_LAYOUT.buttons[0], '暂停', 'pause', 'running');
        this.control(this.root, 'ExitTest', COUNTER_LAYOUT.buttons[1], '退出并返回大厅', 'exit', 'running');
        this.label(this.root, '点击目标或 Enter / Space · Tab / 方向键移动焦点 · P / Esc 暂停或继续', 0, -326, 1160, 28, 18);
        this.pauseOverlay = this.node(this.root, 'PauseOverlay', { x: 0, y: 0, ...DESIGN });
        this.pauseOverlay.addComponent(BlockInputEvents);
        const shade = this.pauseOverlay.addComponent(Graphics);
        shade.fillColor = new Color(40, 34, 27, 205);
        shade.rect(-640, -360, 1280, 720);
        shade.fill();
        this.fill(this.pauseOverlay, { x: 0, y: 0, width: 760, height: 356 }, '#FFFCF6');
        this.label(this.pauseOverlay, '已暂停', 0, 102, 680, 50, 34);
        this.label(this.pauseOverlay, '计数与目标已冻结 · 不接收游戏输入', 0, 28, 680, 36, 22);
        this.control(this.pauseOverlay, 'ResumeTest', { x: -156, y: -96, width: 256, height: 56 }, '继续操作', 'resume', 'paused');
        this.control(this.pauseOverlay, 'ExitPausedTest', { x: 156, y: -96, width: 256, height: 56 }, '退出并返回大厅', 'exit', 'paused');
    }

    public enter(): void {
        if (!this.root || !this.model || this.model.status !== 'ready') throw new Error('Test module is not loaded');
        this.model.enter();
        this.root.active = true;
        this.subscribed = true;
        for (const control of this.controls) control.node.on(Button.EventType.CLICK, control.click, this);
        this.parent.on(Node.EventType.SIZE_CHANGED, this.fit, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.fit();
        this.render();
        console.info('[P1-04] module entered', this.model.session);
    }

    public pause(): void {
        if (this.model?.status !== 'running') return;
        this.model.pause();
        this.focus = 0;
        this.render();
    }

    public resume(): void {
        if (this.model?.status !== 'paused') return;
        this.model.resume();
        this.focus = 0;
        this.render();
    }

    public exit(): void {
        if (this.subscribed) {
            for (const control of this.controls) control.node.off(Button.EventType.CLICK, control.click, this);
            this.parent.off(Node.EventType.SIZE_CHANGED, this.fit, this);
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            this.subscribed = false;
        }
        this.model?.dispose();
        if (this.root && isValid(this.root, true)) this.root.active = false;
    }

    public dispose(): void {
        this.exit();
        if (this.root && isValid(this.root, true)) {
            // Let deferred destruction detach it; its parent may be deactivating.
            this.root.destroy();
        }
        this.root = null;
        this.model = null;
        this.controls.length = 0;
    }

    private activeControls(): Control[] {
        return this.controls.filter(control => control.phase === this.model?.status);
    }

    private activate(action: Action): void {
        if (!this.model || !this.subscribed) return;
        if (action === 'hit') {
            if (!this.model.hit()) return;
            console.info('[P1-04] target hit', this.model.session.sessionId, this.model.count);
            this.render();
        } else if (action === 'pause') this.requests.pause();
        else if (action === 'resume') this.requests.resume();
        else this.requests.exit();
    }

    private onKeyDown(event: EventKeyboard): void {
        if (!this.subscribed) return;
        if (event.keyCode === KeyCode.ESCAPE || event.keyCode === KeyCode.KEY_P) {
            if (this.model?.status === 'running') this.requests.pause();
            else if (this.model?.status === 'paused') this.requests.resume();
            return;
        }
        const active = this.activeControls();
        const forward = [KeyCode.TAB, KeyCode.ARROW_RIGHT, KeyCode.ARROW_DOWN].indexOf(event.keyCode) >= 0;
        const backward = [KeyCode.ARROW_LEFT, KeyCode.ARROW_UP].indexOf(event.keyCode) >= 0;
        if (forward || backward) {
            this.focus = moveFocus(this.focus, active.length, backward ? -1 : 1);
            this.render();
        } else if (event.keyCode === KeyCode.ENTER || event.keyCode === KeyCode.SPACE) {
            const control = active[this.focus];
            if (control) this.activate(control.action);
        }
    }

    private fit(): void {
        if (!this.root || !isValid(this.root, true)) return;
        const size = this.parent.getComponent(UITransform)!.contentSize;
        if (size.width <= 0 || size.height <= 0) return;
        const { scale } = fitDesign(size.width, size.height);
        this.root.setScale(scale, scale, 1);
    }

    private render(): void {
        if (!this.model || !this.root || !isValid(this.root, true)) return;
        const active = this.activeControls();
        this.pauseOverlay.active = this.model.status === 'paused';
        this.countLabel.string = `本局命中：${this.model.count}`;
        const target = COUNTER_LAYOUT.targets[this.model.target];
        this.target.node.setPosition(target.x, target.y, 0);
        for (const control of this.controls) {
            control.button.interactable = active.indexOf(control) >= 0;
            this.paint(control, active[this.focus] === control);
        }
    }

    private node(parent: Node, name: string, box: Box): Node {
        const node = new Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        node.addComponent(UITransform).setContentSize(box.width, box.height);
        node.setPosition(box.x, box.y, 0);
        return node;
    }

    private label(parent: Node, text: string, x: number, y: number, width: number, height: number, size: number): Label {
        const node = this.node(parent, 'Text', { x, y, width, height });
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = size;
        label.lineHeight = size + 8;
        label.horizontalAlign = Label.HorizontalAlign.CENTER;
        label.verticalAlign = Label.VerticalAlign.CENTER;
        label.color = Color.fromHEX(new Color(), '#40382F');
        return label;
    }

    private fill(parent: Node, box: Box, color: string): void {
        const panel = this.node(parent, 'Panel', box);
        const pen = panel.addComponent(Graphics);
        pen.fillColor = Color.fromHEX(new Color(), color);
        pen.roundRect(-box.width / 2, -box.height / 2, box.width, box.height, 18);
        pen.fill();
    }

    private control(parent: Node, name: string, box: Box, text: string, action: Action, phase: 'running' | 'paused'): Control {
        const node = this.node(parent, name, box);
        const control: Control = { node, button: node.addComponent(Button), pen: node.addComponent(Graphics), box, action, phase,
            click: () => {
                const index = this.activeControls().indexOf(control);
                if (index < 0) return;
                this.focus = index;
                this.activate(action);
            } };
        control.button.transition = Button.Transition.NONE;
        this.controls.push(control);
        this.label(node, text, 0, 0, box.width - 16, 40, 22);
        return control;
    }

    private paint(control: Control, focused: boolean): void {
        const { pen, box } = control;
        pen.clear();
        pen.fillColor = Color.fromHEX(new Color(), '#D8E4D9');
        pen.strokeColor = Color.fromHEX(new Color(), focused ? '#4B775F' : '#B5B1A9');
        pen.lineWidth = focused ? 4 : 1;
        pen.roundRect(-box.width / 2 + 3, -box.height / 2 + 3, box.width - 6, box.height - 6, 16);
        pen.fill();
        pen.stroke();
    }
}
