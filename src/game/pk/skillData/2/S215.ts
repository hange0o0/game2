class S215 extends SBase {
    constructor() {
        super();
    }


    public mvID1 = 30;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            target.cleanBuff(PD.actionTime,null,-1)
        }
        return arr;
    }
}