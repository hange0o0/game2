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
            if(des<=atkrage + targetX.getVO().width/2)
            {
                var hp = this.getAtkHp(user,targetX);
                targetX.beAtkAction({hp:hp,atker:user})

                if(targetX.beSkillAble())
                {
                    var skillValue = user.getSkillValue(2);
                    var buff = new PKBuffData()
                    buff.id = 34;
                    buff.value = skillValue;
                    buff.addValue('addSpeed',-skillValue);
                    buff.user = user;
                    buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(3);
                    targetX.addBuff(buff)

                    if(buff.ing)
                    {
                        PKData.getInstance().addVideo({
                            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                            user:targetX,
                            key:1,
                            stateType:1
                        })
                    }
                }
            }
        }
        return true;
    }
}