class S102 extends SBase{
    constructor() {
        super();
    }


    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            targetEnemy.addHp(user.getSkillValue(1,true))
        }
        return arr;
    }
}
