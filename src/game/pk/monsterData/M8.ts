class M8 extends MBase {
    constructor() {
        super();
    }

    protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
        var atk = super.getAtkerAtk(user,target);
        if(target.dieTime)
            atk *= 2;
        return atk;
    }
}