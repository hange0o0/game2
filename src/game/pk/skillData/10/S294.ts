class S294 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            if(target.getVO().type == 3)
                target.setDie();
        }
        return arr;
    }
}