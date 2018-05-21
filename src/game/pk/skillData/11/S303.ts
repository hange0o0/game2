class S303 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(17).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,17,2)
    }
}