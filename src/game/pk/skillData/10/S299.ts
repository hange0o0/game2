class S299 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(6).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,6)
    }
}