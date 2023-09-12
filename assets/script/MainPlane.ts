import { _decorator, Node, AudioSource, BoxCollider, Component, ITriggerEvent } from 'cc';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('MainPlane')
export class MainPlane extends Component {
    @property
    public speed = 5;
    @property(Node)
    public explosion: Node = null;

    @property(Node)
    public blood: Node = null;

    public life = 5;
    public isDied = false;
    private _curLife = 0;
    private _audioClip = null;

    protected onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    protected onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    public init() {
        this._curLife = this.life;
        this.isDied = false;
        this.explosion.active = false;
        this.blood.setScale(1, 1, 1);
    }

    start() {
        this._audioClip = this.getComponent(AudioSource);
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (collisionGroup === Constant.CollisionType.ENEMY_PLANE || collisionGroup === Constant.CollisionType.ENEMY_BULLET) {
            this._curLife--;
            this.blood.setScale(this._curLife / this.life, 1, 1);
            if (this._curLife <= 0) {
                this._audioClip.play();
                this.explosion.active = true;
                this.isDied = true;
            }
        }
    }
}


