class S205 extends SBase {
    constructor() {
        super();
    }


    //生效时的逻辑
    public onSkill(user:PKPosCardData){

        var PD = PKData.getInstance();
        var list = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var targets = [];
        for(var i=0;i<list.length;i++)
        {
            var target:PKMonsterData = list[i];
            if(!target.beSkillAble())
                continue;
            var skillValue = user.getSkillValue(1);
            var addValue = -skillValue
            //target.atk += addValue;
            var buff = new PKBuffData()
            buff.user = user;
            buff.id =  user.mid;
            buff.value = skillValue;
            buff.endTime = PKData.getInstance().actionTime + user.getSkillValue(2)*1000;
            buff.addValue('def',addValue)
            target.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    key:'def',
                    stateType:1
                })
            }
            targets.push(target)
        }

        return targets
    }
}