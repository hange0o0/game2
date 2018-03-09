class M63 extends MBase {
    constructor() {
        super();
    }

    public atkBefore(user:PKMonsterData,actionTime){
        var endTime = actionTime  + this.getAtkMVCD(user)//这个时间后发出攻击时件(前摇)
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
            if(des<=atkrage + targetX.getVO().width/2)
            {
                var hp = this.getAtkHp(user,targetX);
                targetX.beAtkAction({hp:hp,atker:user})

                if(targetX.beSkillAble())
                {
                    var buff = new PKBuffData()
                    buff.id = 63;
                    buff.user = user;
                    buff.addState(PKConfig.STATE_ILL);
                    buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(3);
                    buff.value = user.getSkillValue(2,true)
                    targetX.addBuff(buff)
                }
            }
        }
        return true;
    }

    public onIll(buff:PKBuffData){

        var PD = PKData.getInstance();
        var user = buff.user
        var target = buff.owner
        var arr = PD.getMonsterByTeam(target.getOwner().teamData);
        var atkrage = user.getSkillValue(1);
        for(var i=0;i<arr.length;i++)
        {
            var targetX = arr[i];
            var des = Math.abs(target.x - targetX.x);

            if(des<=atkrage + targetX.getVO().width/2)
            {
                targetX.beAtkAction({hp:buff.value})
            }
        }
    }
}