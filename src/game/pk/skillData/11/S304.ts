class S304 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(18).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,18)
    }
}