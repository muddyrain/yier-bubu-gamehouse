import { Color, Graphics, Node, UITransform } from 'cc';
import { CHARACTERS } from './LobbyModel';
import type { Box, CharacterId } from './LobbyModel';

/** Replace this implementation when licensed resources arrive; identity never depends on pixels. */
export interface CharacterVisualRenderer {
    create(parent: Node, id: CharacterId, box: Box): Node;
}
export const characterVisuals: CharacterVisualRenderer = Object.freeze({
    create(parent: Node, id: CharacterId, box: Box): Node {
        const character = CHARACTERS.find(entry => entry.id === id);
        if (!character) throw new Error('Unknown character visual ID');
        const node = new Node(id);
        node.layer = parent.layer;
        parent.addChild(node);
        node.addComponent(UITransform).setContentSize(box.width, box.height);
        node.setPosition(box.x, box.y, 0);
        // Unchanged P1-03 original geometry. No downloaded or newly designed final character art.
        const pen = node.addComponent(Graphics);
        pen.fillColor = Color.fromHEX(new Color(), character.color);
        pen.circle(-31, 47, 17);
        pen.circle(31, 47, 17);
        pen.ellipse(0, -28, 39, 30);
        pen.circle(0, 14, 41);
        pen.fill();
        pen.fillColor = Color.fromHEX(new Color(), '#40382F');
        pen.circle(-13, 20, 3);
        pen.circle(13, 20, 3);
        pen.ellipse(0, 5, 5, 3);
        pen.fill();
        return node;
    },
});
