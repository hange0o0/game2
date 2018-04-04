class S230 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        var targets = [];
        var skillValue = user.getSkillValue(1);
        var cd = user.getSkillValue(2)*1000;
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(targetEnemy.getVO().type != 2)
                continue;
            if(!targetEnemy.beSkillAble())
                continue;
            var addValue = Math.floor(targetEnemy.baseAtk * skillValue/100);
            var buff = new PKBuffData()
            buff.user = user;
            buff.id = 230;
            buff.value = skillValue;
            buff.endTime = PKData.getInstance().actionTime + cd;
            buff.addValue('atk',-addValue)
            buff.isDebuff = true;
            targetEnemy.addBuff(buff)
            targets.push(targetEnemy);

            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:targetEnemy,
                key:'atk',
                stateType:2
            })
        }
        return targets;
    }
}