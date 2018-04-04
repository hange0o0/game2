class S300 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(10).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,10)
    }
}