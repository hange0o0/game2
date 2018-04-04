class S288 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var value = user.getSkillValue(1,true);
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            if(!target.dieTime)
                continue;
            if(!target.beSkillAble())
                continue;
            target.addHp(-value)
        }
        return arr;
    }
}