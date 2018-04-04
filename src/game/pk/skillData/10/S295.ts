class S295 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(1).preLoad();
    }

    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,1)
    }
}