class S225 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var teamData = user.getOwner().teamData.enemy;
        var arr = PD.getMonsterByTeam(teamData);
        var targets = [];
        var value = user.getSkillValue(2,true)
        var rage = user.getSkillValue(1)
        var xx = PKData.getInstance().getFirstX(teamData.id) - teamData.atkRota*rage;
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            var des = Math.abs(targetEnemy.x - xx);
            if(des<=rage)
            {
                targetEnemy.addHp(-value)
                targets.push(targetEnemy);
            }
        }
        return targets;
    }
}