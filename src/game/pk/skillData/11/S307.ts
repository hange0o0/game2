class S307 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(33).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,33)
    }
}