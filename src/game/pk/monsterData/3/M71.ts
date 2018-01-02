class M71 extends MBase {
    constructor() {
        super();
    }

    //取最终伤害
    protected getAtkHp(user:PKMonsterData,target:PKMonsterData){
        if(target.mid == 99)
            return 1
        return Math.ceil(target.maxHp/100*user.getSkillValue(1));
    }
}