class S204 extends SBase {
    constructor() {
        super();
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData){
        var PD = PKData.getInstance();
        var list = PD.getMonsterByTeam(user.getOwner().teamData);
        var skillValue = user.getSkillValue(1);
        var cd = user.getSkillValue(2)*1000;
        for(var i=0;i<list.length;i++)
        {
            var target:PKMonsterData = list[i];
            var addValue = Math.floor(target.baseAtk * skillValue/100);
            //target.atk += addValue;
            var buff = new PKBuffData()
            buff.user = user;
            buff.id = user.mid;
            buff.value = skillValue;
            buff.endTime = PKData.getInstance().actionTime + cd;
            buff.addValue('atk',addValue)
            target.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    key:'atk',
                    stateType:1
                })
            }
        }
        return list;



    }
}