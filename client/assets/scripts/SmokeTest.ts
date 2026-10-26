import { _decorator, Color, Component, Graphics, Label, Node, UITransform } from 'cc';

const { ccclass } = _decorator;

/** P1-01 startup probe only. No game, character selection, or saved data. */
@ccclass('SmokeTest')
export class SmokeTest extends Component {
    start(): void {
        this.addLabel('一二布布游戏屋', 210, 34);
        this.addLabel('P1-01 · 场景启动测试', 155, 22);
        this.addPlaceholder('一二 · 小白熊占位', -260, new Color(245, 245, 245));
        this.addPlaceholder('布布 · 小棕熊占位', 260, new Color(150, 99, 65));
        this.addLabel('场景与 TypeScript 已启动', -185, 24);
        this.addLabel('正式大厅与游戏玩法尚未开发', -230, 20);
        console.info('[P1-01] SmokeTest started: yier + bubu placeholders.');
    }

    private addLabel(text: string, y: number, fontSize: number, x = 0, width = 600): void {
        const node = new Node('SmokeLabel');
        node.layer = this.node.layer;
        this.node.addChild(node);
        node.setPosition(x, y);
        node.addComponent(UITransform).setContentSize(width, 54);
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 8;
    }

    private addPlaceholder(text: string, x: number, color: Color): void {
        const node = new Node('Placeholder');
        node.layer = this.node.layer;
        this.node.addChild(node);
        node.setPosition(x, 10);
        node.addComponent(UITransform).setContentSize(140, 140);
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = color;
        graphics.rect(-70, -70, 140, 140);
        graphics.fill();
        this.addLabel(text, -105, 20, x, 320);
    }
}
