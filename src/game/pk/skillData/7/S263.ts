class S263 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 166;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.dieTime)
                target.setDie();
        }
        return arr;
    }
}