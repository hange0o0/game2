class M42 extends MBase {
    constructor() {
        super();
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        var target = data.atker
        if(target && target.getVO().atkrage <= PKConfig.nearRage)
        {
            if(target.beSkillAble())
            {
                var skillValue = user.getSkillValue(1,true)
                var buff = new PKBuffData()
                buff.id = 35;
                buff.value = skillValue
                buff.addValue('hpChange',-skillValue);
                buff.user = user;
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
                target.addBuff(buff)

                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        key:'hp',
                        stateType:2
                    })
                }
            }
        }
    }
}