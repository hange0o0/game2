class S313 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(41).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,41,1)
    }
}