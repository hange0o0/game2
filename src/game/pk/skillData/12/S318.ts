class S318 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(64).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,64,2)
    }
}