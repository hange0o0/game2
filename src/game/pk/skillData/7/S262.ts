class S262 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 166;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        var value = user.getSkillValue(1,true);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.isHero())
                continue;
            if(target.hp < value)
                target.setDie();
        }
        return arr;
    }
}