class S264 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.monsterList.concat();
        var cd = 1000*user.getSkillValue(1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];

            var buff = new PKBuffData()
            buff.id = 264;
            buff.user = user;
            buff.addState(PKConfig.STATE_MOMIAN);
            buff.endTime = PD.actionTime + cd
            target.addBuff(buff)
        }
        return arr;
    }
}