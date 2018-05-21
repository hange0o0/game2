class S308 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(34).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        return this.addMonsterSkill(user,34)
    }
}