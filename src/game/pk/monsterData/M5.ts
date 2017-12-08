class M5 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.doubleRate = 0.3;
        user.doubleValue = 2;
    }
}