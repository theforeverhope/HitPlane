import { _decorator, Component, instantiate, Node, Prefab, math, SystemEvent, systemEvent, Touch, sp, Vec3, BoxCollider, macro, Label, Animation } from 'cc';
import { Bullet } from './Bullet';
import { Constant } from './Constant';
import { EnemyPlane } from './EnemyPlane';
import { BulletProp } from './BulletProp';
import { MainPlane } from './MainPlane';
import { AudioManager } from './AudioManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    playerPlane: Node = null;

    @property(Prefab)
    bullet01: Prefab = null;
    @property(Prefab)
    bullet02: Prefab = null;
    @property(Prefab)
    bullet03: Prefab = null;
    @property(Prefab)
    bullet04: Prefab = null;
    @property(Prefab)
    bullet05: Prefab = null;

    @property
    shootTime = 0.1;

    @property
    bulletSpeed = 0.3;

    @property(Node)
    bulletManager: Node = null;

    @property(Prefab)
    enemyPlane1: Prefab = null;

    @property(Prefab)
    enemyPlane2: Prefab = null;

    @property
    createEmenyTime = 1;

    @property
    public enemySpeed1 = 0.2;
    @property
    public enemySpeed2 = 0.3;

    @property(Prefab)
    public bulletPropH: Prefab = null;
    @property(Prefab)
    public bulletPropS: Prefab = null;
    @property(Prefab)
    public bulletPropM: Prefab = null;

    @property
    public bulletPropSpeed = 0.1;

    @property(Node)
    public gamePanel: Node = null;
    @property(Node)
    public endPanel: Node = null;

    @property(Label)
    public scoreLabel = null;
    @property(Label)
    public totalScoreLabel = null;

    @property(Animation)
    public endPanelAnim: Animation = null;

    @property(AudioManager)
    public audioManager: AudioManager = null;

    @property(Prefab)
    public enemyExplosion: Prefab = null;

    public isGameStart: boolean = false;


    private _score = 0;
    private _isShoot = false;
    private _curShootTime = 0; 
    private _curCreateEnemyTime = 0;
    private _combinationInterval = Constant.Combination.STAGE_ONE;

    private _bulletType = Constant.BulletPropType.BULLET_M;

    start() {}

    update(deltaTime: number) {
        if (!this.isGameStart) {
            return;
        }

        if (this.playerPlane.getComponent(MainPlane).isDied) {
            this.gameOver();
            return;
        }

        this._curShootTime += deltaTime;
        let name = 'bullet1';
        if (this._isShoot && this._curShootTime > this.shootTime) {
            if (this._bulletType === Constant.BulletPropType.BULLET_H) {
                this.createPlayerBulletH();
                name = 'bullet2';
            } else if (this._bulletType === Constant.BulletPropType.BULLET_S) {
                this.createPlayerBulletS();
                name = 'bullet2';
            } else {
                this.createPlayerBullet();
            } 

            this.playAudioEffect(name);
            this._curShootTime = 0;
        }

        this._curCreateEnemyTime += deltaTime;

        if (this._combinationInterval === Constant.Combination.STAGE_ONE) {
            if (this._curCreateEnemyTime > this.createEmenyTime) {
                this.createEnemyPlane();
                this._curCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.Combination.STAGE_TWO) {
            if (this._curCreateEnemyTime > this.createEmenyTime * 0.9) {
                const randomFormation = math.randomRangeInt(1, 3);
                if (randomFormation === Constant.PlaneFormation.SINGLE) {
                    this.createEnemyPlane();
                } else {
                    this.createCombinationLine();
                }
                this._curCreateEnemyTime = 0;
            }
        } else {
            if (this._curCreateEnemyTime > this.createEmenyTime * 0.8) {
                const randomFormation = math.randomRangeInt(1, 4);
                if (randomFormation === Constant.PlaneFormation.SINGLE) {
                    this.createEnemyPlane();
                } else if (randomFormation === Constant.PlaneFormation.LINE) {
                    this.createCombinationLine();
                } else {
                    this.createCombinationV(); 
                }
                this._curCreateEnemyTime = 0;
            }
        }
    }

    public reset() {
        this._score = 0;
        this.scoreLabel.string = '0';
        this._curShootTime = 0; 
        this._curCreateEnemyTime = 0;
        this._combinationInterval = Constant.Combination.STAGE_ONE;
        this._bulletType = Constant.BulletPropType.BULLET_M;
        this.playerPlane.setPosition(0, 0, 15);
    }

    public gameStart() {
        this.isGameStart = true;
        this._curShootTime = this.shootTime;
        this._changePlaneMode();
        this.playerPlane.getComponent(MainPlane).init();
    }

    public gameOver() {
        this.isGameStart = false;
        this.gamePanel.active = false;
        this.endPanel.active = true;
        this.endPanelAnim.play();
        this.totalScoreLabel.string = this._score.toString();
        this._isShoot = false;
        this.unschedule(this._modeChange);
        this._destroyAll();
    }

    public createPlayerBullet() {
        const distance = 7;
        const bullet = PoolManager.instance().getNode(this.bullet01, this.bulletManager);
        const playerPos = this.playerPlane.position;
        bullet.setPosition(playerPos.x, playerPos.y, playerPos.z - distance);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false);
    }

    public createPlayerBulletH() {
        const distance = 7;
        const playerPos = this.playerPlane.position;
        // left
        const bulletLeft = PoolManager.instance().getNode(this.bullet03, this.bulletManager);
        bulletLeft.setPosition(playerPos.x - 2.5, playerPos.y, playerPos.z - distance);
        const bulletLeftComp = bulletLeft.getComponent(Bullet);
        bulletLeftComp.show(this.bulletSpeed, false);
        // right
        const bulletRight = PoolManager.instance().getNode(this.bullet03, this.bulletManager);
        bulletRight.setPosition(playerPos.x + 2.5, playerPos.y, playerPos.z - distance);
        const bulletRightComp = bulletRight.getComponent(Bullet);
        bulletRightComp.show(this.bulletSpeed, false);
    }

    public createPlayerBulletS() {
        const distance = 7;
        const playerPos = this.playerPlane.position;
        // middle
        const bullet = PoolManager.instance().getNode(this.bullet05, this.bulletManager);
        bullet.setPosition(playerPos.x, playerPos.y, playerPos.z - distance);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false);
        // left
        const bulletLeft = PoolManager.instance().getNode(this.bullet05, this.bulletManager);
        bulletLeft.setPosition(playerPos.x - 4, playerPos.y, playerPos.z - distance);
        const bulletLeftComp = bulletLeft.getComponent(Bullet);
        bulletLeftComp.show(this.bulletSpeed, false, Constant.BulletDirection.Left);
        // right
        const bulletRight = PoolManager.instance().getNode(this.bullet05, this.bulletManager);
        bulletRight.setPosition(playerPos.x + 4, playerPos.y, playerPos.z - distance);
        const bulletRightComp = bulletRight.getComponent(Bullet);
        bulletRightComp.show(this.bulletSpeed, false,  Constant.BulletDirection.Right);
    }

    public createEnemyBullet(pos: Vec3) {
        const distance = 6;
        const bullet = PoolManager.instance().getNode(this.bullet02, this.bulletManager);
        bullet.setPosition(pos.x, pos.y, pos.z + distance);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(1, true);

        const colliderComp = bullet.getComponent(BoxCollider);
        colliderComp.setGroup(Constant.CollisionType.ENEMY_BULLET);
        colliderComp.setMask(Constant.CollisionType.MAIN_PLANE);
    }

    public setShoot(isShoot: boolean) {
        this._isShoot = isShoot;
    }

    public createEnemyPlane() {
        const whichEnemy = math.randomRangeInt(1,3);
        let prefab: Prefab = null;
        let speed = 0;
        if (whichEnemy === Constant.EnemyType.TYPE1) {
            prefab = this.enemyPlane1;
            speed = this.enemySpeed1;
        } else {
            prefab = this.enemyPlane2;
            speed = this.enemySpeed2;
        }

        const enemy = PoolManager.instance().getNode(prefab, this.node);
        const enemyComp = enemy.getComponent(EnemyPlane);
        enemyComp.show(this, speed, true);

        const randomPos = math.randomRangeInt(-25, 26);
        enemy.setPosition(randomPos, 0, -50);
    }

    public createEnemyExplosion(pos: Vec3) {
        const effect = PoolManager.instance().getNode(this.enemyExplosion, this.node);
        effect.setPosition(pos);
    }

    public createCombinationLine() {
        const enemyArray = new Array<Node>(5);
        
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = PoolManager.instance().getNode(this.enemyPlane1, this.node);
            const element = enemyArray[i];
            element.setPosition(-20 + i * 10, 0 , -50);
            const enemyComp = element.getComponent(EnemyPlane);
            enemyComp.show(this, this.enemySpeed1, false);
        }
    }

    public createCombinationV() {
        const enemyArray = new Array<Node>(7);
        const pos = [
            [-21, 0, -60],
            [-14, 0, -55],
            [-7, 0, -50],
            [0, 0, -45],
            [7, 0, -50],
            [14, 0, -55],
            [21, 0, -60],
        ];

        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = PoolManager.instance().getNode(this.enemyPlane2, this.node);
            const element = enemyArray[i];
            element.setPosition(pos[i][0], pos[i][1], pos[i][2]);
            const enemyComp = element.getComponent(EnemyPlane);
            enemyComp.show(this, this.enemySpeed2, false);
        }
    }

    public addScore() {
        this._score++;
        this.scoreLabel.string = this._score.toString();
    }

    public changeBulletType(type: string) {
        this._bulletType = type;
    }

    public createBulletProp() {
        const randomProp = math.randomRangeInt(1, 4);
        let prefab: Prefab = null;
        if (randomProp === 1) {
            prefab = this.bulletPropH;
        } else if (randomProp === 2) {
            prefab = this.bulletPropS;
        } else {
            prefab = this.bulletPropM;
        }

        const prop = PoolManager.instance().getNode(prefab, this.node);
        prop.setPosition(15, 0, -50);
        const propComp = prop.getComponent(BulletProp);
        propComp.show(this, -this.bulletPropSpeed);
    }

    public playAudioEffect(name: string) {
        this.audioManager.play(name);
    }

    private _changePlaneMode() {
        this.schedule(this._modeChange, 10, macro.REPEAT_FOREVER);
    }

    private _modeChange() {
        this._combinationInterval++;
        this.createBulletProp();
    }

    private _destroyAll() {
        let children = this.node.children;
        let len = children.length;
        for (let i = len - 1; i >= 0; i--) {
            const child = children[i];
            PoolManager.instance().putNode(child);
        }

        children = this.bulletManager.children;
        len = children.length;
        for (let i = len - 1; i >= 0; i--) {
            const child = children[i];
            PoolManager.instance().putNode(child);
        }
    }
}


