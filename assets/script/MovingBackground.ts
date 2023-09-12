import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MovingBackground')
export class MovingBackground extends Component {
    @property(Node)
    background01: Node = null;

    @property(Node)
    background02: Node = null;

    private _bgMovingSpeed = 10;
    private _bgMovingRange = 90;

    start() {
        this._init();
    }

    update(deltaTime: number) {
        this._moveBackground(deltaTime);
    }

    private _init() {
        this.background01.setPosition(0, 0, 0);
        this.background02.setPosition(0, 0, -this._bgMovingRange); 
    }

    private _moveBackground(dt: number) {
        this.background01.setPosition(0, 0, this.background01.position.z + this._bgMovingSpeed * dt);
        this.background02.setPosition(0, 0, this.background02.position.z + this._bgMovingSpeed * dt);
        if (this.background01.position.z > this._bgMovingRange) {
            this.background01.setPosition(0, 0, this.background02.position.z - this._bgMovingRange);
        }
        if (this.background02.position.z > this._bgMovingRange) {
            this.background02.setPosition(0, 0, this.background01.position.z - this._bgMovingRange);
        }
    }
}


