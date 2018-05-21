class S216 extends SBase {
    constructor() {
        super();
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData){

        var PD = PKData.getInstance();
        var list = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var targets = [];
        var skillValue = user.getSkillValue(1);
        var addValue = user.getSkillValue(3,true);
        var cd = user.getSkillValue(2)*1000;
        for(var i=0;i<list.length;i++)
        {
            var target:PKMonsterData = list[i];

            var buff = new PKBuffData()
            buff.user = user;
            buff.id =  216;
            buff.value = skillValue;
            buff.endTime = PKData.getInstance().actionTime + cd;
            buff.addValue('atk',Math.ceil(skillValue/100*target.baseAtk))
            target.addBuff(buff)
            target.addHp(addValue)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    key:'atk',
                    stateType:1
                })
            }
            targets.push(target)
        }

        return targets
    }
}