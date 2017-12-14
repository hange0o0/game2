class M16 extends MBase {
    constructor() {
        super();
    }

    //a对B攻击到达时的逻辑（攻击正式生效）
    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b)
        {
            var skillValue = user.getSkillValue(1,true)
            var buff = new PKBuffData()
            buff.id = 16;
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
                    key:1,
                    stateType:1
                })
            }
        }
        return b;
    }
}