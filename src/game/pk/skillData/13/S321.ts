class S321 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(73).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,73)
    }
}