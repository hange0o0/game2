class S248 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var cd = user.getSkillValue(1)*1000;
        var hp = user.getSkillValue(2,true);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.beSkillAble())
                target.beAtkAction({hp:hp})

            var buff = new PKBuffData()
            buff.user = user;
            buff.isDebuff = true;
            buff.addState(PKConfig.STATE_YUN);
            buff.endTime = PD.actionTime + cd;
            target.addBuff(buff)
        }
        return arr;
    }
}