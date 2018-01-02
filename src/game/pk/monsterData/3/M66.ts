class M66 extends MBase {
    constructor() {
        super();
    }

    //取攻击力
    protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
        var atk = super.getAtkerAtk(user,target)
        atk += atk * (target.skillTemp[66] || 0)/100
        return atk;
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(b)
            target.skillTemp[66] = (target.skillTemp[66] || 0) + user.getSkillValue(1)
        return b;
    }
}