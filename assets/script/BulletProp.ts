import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
import { Constant } from './Constant';
import { GameManager } from './GameManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

const OUTER_RANGE = 50;

@ccclass('BulletProp')
export class BulletProp extends Component {
    private _propSpeed = 0.3;
    private _propXSpeed = 0.3;
    private _gameManager: GameManager = null; 

    protected onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    protected onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    update(deltaTime: number) {
        let pos = this.node.position;
        if (pos.x >= 15) {
            this._propXSpeed = this._propSpeed;
        } else if (pos.x <= -15) {
            this._propXSpeed = -this._propSpeed;
        }

        this.node.setPosition(pos.x + this._propXSpeed, pos.y, pos.z - this._propSpeed);

        pos = this.node.position;
        if (pos.z > OUTER_RANGE) {
            PoolManager.instance().putNode(this.node);
        }
    }

    public show(gameManager: GameManager, speed: number) {
        this._gameManager = gameManager;
        this._propSpeed = speed;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const name = event.selfCollider.node.name;
        if (name === Constant.BulletPropType.BULLET_H || name === Constant.BulletPropType.BULLET_S) {
            this._gameManager.changeBulletType(name);
        } else {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M);
        }

        PoolManager.instance().putNode(this.node);
    }
}


