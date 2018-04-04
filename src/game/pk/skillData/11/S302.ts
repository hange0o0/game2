class S302 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(14).preLoad();
    }

    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,14,1)
    }
}