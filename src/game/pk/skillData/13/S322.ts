class S322 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(76).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,76)
    }
}