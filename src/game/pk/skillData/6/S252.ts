class S252 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 5
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var num = user.getSkillValue(1)
        if(arr.length > num)
        {
            PD.randSort(arr)
        }
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.isHero())
                continue;
            target.setDie();
            num --;
            if(num <= 0)
                break;
        }
        return arr;
    }
}