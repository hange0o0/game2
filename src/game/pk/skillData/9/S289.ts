class S289 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        var cd = user.getSkillValue(1)*1000;
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            if(!target.dieTime)
                continue;
            target.dieTime += cd;
        }
        return arr;
    }
}