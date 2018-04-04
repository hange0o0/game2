class S244 extends SBase {
    constructor() {
        super();
    }
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var addValue = user.getSkillValue(1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            target.nohitTimes += addValue
        }
        return arr;
    }

}