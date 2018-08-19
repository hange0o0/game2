class S255 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.isHero())
                continue;
            target.setDie();
        }
        return arr;
    }
}