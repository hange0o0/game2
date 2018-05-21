class S243 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var addValue = user.getSkillValue(1);
        var addValue2 = user.getSkillValue(2,true);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            target.nohitTimes += addValue
            target.addHp(addValue2)
        }
        return arr;
    }
}