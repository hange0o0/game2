class S201 extends SBase{
    constructor() {
        super();
    }



    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        var targets = [];
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            targetEnemy.addHp(-user.getSkillValue(1,true))
            targets.push(targetEnemy);
        }
        return targets;
    }

}
