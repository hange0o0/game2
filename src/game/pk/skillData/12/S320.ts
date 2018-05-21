class S320 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(70).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,70)
    }
}