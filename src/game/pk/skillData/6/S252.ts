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
            arr.length = num;
        }
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            target.setDie();
        }
        return arr;
    }
}