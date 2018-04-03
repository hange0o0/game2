class S234 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList;
        var targets = [];
        var skillValue = user.getSkillValue(1);
        var cd = user.getSkillValue(2)*1000;
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(targetEnemy.getVO().type != 3)
                continue;
            var addValue = Math.floor(targetEnemy.baseAtk * skillValue/100);
            var buff = new PKBuffData()
            buff.user = user;
            buff.id = 234;
            buff.value = skillValue;
            buff.endTime = PKData.getInstance().actionTime + cd;
            buff.addValue('atk',addValue)
            targetEnemy.addBuff(buff)
            targets.push(targetEnemy);
        }
        return targets;
    }
}