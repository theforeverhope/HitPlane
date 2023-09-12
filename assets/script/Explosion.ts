import { _decorator, Component, Node } from 'cc';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('Explosion')
export class Explosion extends Component {
    protected onEnable(): void {
        this.scheduleOnce(this._putBack, 1);
    }

    private _putBack() {
        PoolManager.instance().putNode(this.node);
    }
}


