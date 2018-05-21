class S301 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(11).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,11)
    }
}