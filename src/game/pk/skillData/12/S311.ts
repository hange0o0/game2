class S311 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(39).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,39)
    }
}