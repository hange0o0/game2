class S226 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var teamData = user.getOwner().teamData.enemy;
        var arr = PD.getMonsterByTeam(teamData);
        var value = user.getSkillValue(1,true)
        while(true)
        {
            var target = PD.randomOne(arr,true)
            if(!target)
                return [];
            if(target.beSkillAble())
            {
                target.addHp(-value)
                return [target]
            }
        }
    }
}