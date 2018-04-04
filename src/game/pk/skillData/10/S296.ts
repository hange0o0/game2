class S296 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(2).preLoad();
    }

    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,2,2)
    }
}