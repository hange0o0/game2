class S306 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(32).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,32)
    }
}