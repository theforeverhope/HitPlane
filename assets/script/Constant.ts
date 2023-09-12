import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constant')
export class Constant {
    public static EnemyType = {
        TYPE1: 1,
        TYPE2: 2
    }

    public static PlaneFormation = {
        SINGLE: 1,
        LINE: 2,
        V: 3,
    }

    public static Combination = {
        STAGE_ONE: 1, // 10s single plane
        STAGE_TWO: 2, // 10s~20s single plane and plane in line 
        STAGE_THREE: 3 // after 20s single plane and plane in line and plane in V
    }

    public static CollisionType = {
        MAIN_PLANE: 1 << 1,
        ENEMY_PLANE: 1 << 2,
        MAIN_BULLET: 1 << 3,
        ENEMY_BULLET: 1 << 4,
        BULLET_PROP: 1 << 5,
    }

    public static BulletPropType = {
        BULLET_S: 'bulletS',
        BULLET_M: 'bulletM',
        BULLET_H: 'bulletH',
    }

    public static BulletDirection = {
        Left: 1,
        Middle: 2,
        Right: 3,
    }
}


