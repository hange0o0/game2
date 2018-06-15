class S227 extends SBase {
    constructor() {
        super();
    }
    public mvID1 = 104;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var teamData = user.getOwner().teamData.enemy;
        var arr = PD.getMonsterByTeam(teamData);
        var target;
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            if(!target || targetEnemy.hp > target.hp)
                target = targetEnemy
        }
        if(target)
        {
            var value = user.getSkillValue(1,true)
            target.addHp(-value)
            return [target]
        }
        return [];
    }
}