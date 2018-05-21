class S309 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(35).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,35)
    }
}