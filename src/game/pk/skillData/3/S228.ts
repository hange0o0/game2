class S228 extends SBase {
    constructor() {
        super();
    }
    public mvID1 = 128;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        var targets = [];
        var value = user.getSkillValue(1,true);
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            targetEnemy.addHp(value)
            targets.push(targetEnemy);
        }
        return targets;
    }
}