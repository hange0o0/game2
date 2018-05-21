class S314 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(42).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,42)
    }
}