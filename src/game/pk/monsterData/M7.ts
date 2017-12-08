class M7 extends MBase {
    constructor() {
        super();
    }

    protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
        var atk = super.getAtkerAtk(user,target);
        if(user.getHpRate() < 0.3)
            atk *= 2;
        return atk;
    }
}