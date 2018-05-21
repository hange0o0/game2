class S298 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(9).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,9)
    }
}