class S312 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(40).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,40,1)
    }
}