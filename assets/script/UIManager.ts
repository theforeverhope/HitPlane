import { _decorator, Component, Node, SystemEvent, Touch } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    @property
    public speed = 5;

    @property(Node)
    playerPlane: Node = null;

    @property(GameManager) 
    gameManager: GameManager = null;

    @property(Node)
    startPanel: Node = null;
    @property(Node)
    gamePanel: Node = null;
    @property(Node)
    endPanel: Node = null;

    start() {
        this.node.on(SystemEvent.EventType.TOUCH_MOVE, this._touchMove, this);
        this.node.on(SystemEvent.EventType.TOUCH_START, this._touchStart, this);
        this.node.on(SystemEvent.EventType.TOUCH_END, this._touchEnd, this);
        this.startPanel.active = true;
    }

    update(deltaTime: number) {
        
    }

    public reStart() {
        this.endPanel.active = false;
        this.startPanel.active = true;
        this.gameManager.reset();
        this.gameManager.playAudioEffect('button');
    }

    private _touchMove(touch: Touch) {
        if (!this.gameManager.isGameStart) {
            return;
        }

        const delta = touch.getDelta();
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + 0.01 * this.speed *delta.x, pos.y , pos.z - 0.01 * this.speed *delta.y)
    }

    private _touchStart(touch: Touch) {
        if (this.gameManager.isGameStart) {
            this.gameManager.setShoot(true);
        } else {
            this.startPanel.active = false;
            this.gamePanel.active = true;
            this.gameManager.playAudioEffect('button');
            this.gameManager.gameStart();
        }
    }

    private _touchEnd(touch: Touch) {
        if (!this.gameManager.isGameStart) {
            return;
        }
        this.gameManager.setShoot(false);
    }
}


