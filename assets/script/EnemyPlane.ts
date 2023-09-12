import { _decorator, BoxCollider, Component, ITriggerEvent } from 'cc';
import { GameManager } from './GameManager';
import { Constant } from './Constant';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

const OUTER_RANGE = 50;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property
    public createBulletTime = 0.5;

    private _speed = 0;
    private _curCreateBulletTime = 0;
    private _needBullet = false;
    private _gameManager: GameManager = null;

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
        const moveZ = pos.z + this._speed;
        this.node.setPosition(pos.x, pos.y, moveZ);

        if (this._needBullet) {
            this._curCreateBulletTime += deltaTime;
            if (this._curCreateBulletTime > this.createBulletTime) {
                this._gameManager.createEnemyBullet(this.node.getPosition());
                this._curCreateBulletTime = 0;
            }
        }

        if (moveZ > OUTER_RANGE) {
            PoolManager.instance().putNode(this.node);
        }
    }

    show(gameManager: GameManager, speed: number, needBullet: boolean) {
        this._gameManager = gameManager;
        this._speed = speed;
        this._needBullet = needBullet;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (collisionGroup === Constant.CollisionType.MAIN_PLANE || collisionGroup === Constant.CollisionType.MAIN_BULLET) {
            this._gameManager.playAudioEffect('enemy');
            PoolManager.instance().putNode(this.node);
            this._gameManager.createEnemyExplosion(this.node.position);
            this._gameManager.addScore();
        }
    }
}


