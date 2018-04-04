class S305 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(31).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,31)
    }
}