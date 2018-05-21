class S319 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(65).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,65,0,true)
    }
}