class M76 extends MBase {
    constructor() {
        super();
    }

    public atkBefore(user:PKMonsterData,actionTime){
        var endTime = actionTime  + this.getAtkMVCD(user)//这个时间后发出攻击时件(前摇)
        this.sendAtkBefore(user,user,actionTime,endTime)
    }

    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 300;
    }



    public atk(user:PKMonsterData,target:PKMonsterData){
        user.setDie();
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByNoTeam(user.getOwner().teamData);
        var atkrage = user.getSkillValue(1);
        var skillValue = user.getSkillValue(2,true)
        var cd = 1000*user.getSkillValue(3);
        for(var i=0;i<arr.length;i++)
        {
            var targetX = arr[i];
            var des = Math.abs(user.x - targetX.x);
            if(des<=atkrage + targetX.getVO().width/2)
            {
                var hp = this.getAtkHp(user,targetX);
                targetX.beAtkAction({hp:hp,atker:user})
                user.addAtkHurt(hp)

                if(targetX.beSkillAble())
                {
                    var buff = new PKBuffData()
                    buff.id = 76;
                    buff.value = skillValue
                    buff.addValue('hpChange',-skillValue);
                    buff.user = user;
                    buff.endTime = PKData.getInstance().actionTime + cd;
                    targetX.addBuff(buff)

                    if(buff.ing)
                    {
                        PKData.getInstance().addVideo({
                            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                            user:targetX,
                            keys:['hp-']
                        })
                    }
                }
            }
        }
        return true;
    }
}