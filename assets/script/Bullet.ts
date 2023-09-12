import { _decorator, BoxCollider, Component, ITriggerEvent } from 'cc';
import { Constant } from './Constant';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

const MAIN_OUTER_RANGE = -50;
const ENEMY_OUTER_RANGE = 50;

@ccclass('Bullet')
export class Bullet extends Component {
    private _speed = 0;
    private _isEnemyBullet = false;
    private _direction: number = Constant.BulletDirection.Middle;

    protected onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    protected onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        let movingLength = 0;
        if (this._isEnemyBullet) {
            movingLength = pos.z + this._speed;
            this.node.setPosition(pos.x, pos.y, movingLength);
        } else {
            movingLength = pos.z - this._speed;
            if (this._direction === Constant.BulletDirection.Left) {
                this.node.setPosition(pos.x - this._speed * 0.3, pos.y, movingLength);
            } else if (this._direction === Constant.BulletDirection.Right) {
                this.node.setPosition(pos.x + this._speed * 0.3, pos.y, movingLength);
            } else {
                this.node.setPosition(pos.x, pos.y, movingLength);
            }
        }

        if (this._isEnemyBullet && movingLength > ENEMY_OUTER_RANGE) {
            PoolManager.instance().putNode(this.node);
        } else if (!this._isEnemyBullet && movingLength < MAIN_OUTER_RANGE) {
            PoolManager.instance().putNode(this.node);
        }
    }

    show(speed: number, isEnemyBullet: boolean, direction?: number) {
        this._speed = speed;
        this._isEnemyBullet = isEnemyBullet;
        this._direction = direction;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        PoolManager.instance().putNode(this.node);
    }
}


