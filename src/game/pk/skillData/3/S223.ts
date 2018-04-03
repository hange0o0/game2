class S223 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var targets = [];
        var value = user.getSkillValue(1,true)
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            if(targetEnemy.dieTime)
                targetEnemy.addHp(-value*2)
            else
                targetEnemy.addHp(-value)
            targets.push(targetEnemy);
        }
        return targets;
    }
}