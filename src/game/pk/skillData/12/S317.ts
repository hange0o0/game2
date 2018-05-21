class S317 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(63).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,63)
    }
}