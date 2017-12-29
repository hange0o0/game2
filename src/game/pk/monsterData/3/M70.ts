class M70 extends MBase {
    constructor() {
        super();
    }

    public atkBefore(user:PKMonsterData,actionTime){
        var endTime = actionTime + user.getVO().mv_atk//这个时间后发出攻击时件(前摇)
        var targets = this.getAtkTargets(user);
        this.sendAtkBefore(user,user,actionTime,endTime)
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        user.addHp(-999999)
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByNoTeam(user.getOwner().teamData);
        var atkrage = user.getSkillValue(1);
        for(var i=0;i<arr.length;i++)
        {
            var targetX = arr[i];
            var des = Math.abs(user.x - targetX.x);
            if(des<=atkrage)
            {
                var hp = this.getAtkHp(user,targetX);
                targetX.beAtkAction({hp:hp,atker:user})
            }
        }
        return true;
    }
}