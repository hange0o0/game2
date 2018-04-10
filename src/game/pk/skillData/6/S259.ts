class S259 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var value = user.getSkillValue(1,true);
        var cd = user.getSkillValue(2)*1000
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(!target.beSkillAble())
                continue;

            var buff = new PKBuffData()
            buff.id = 259;
            buff.value = value;
            buff.user = user;
            buff.isDebuff = true;
            buff.addValue('hpChange',-value);
            buff.endTime = PKData.getInstance().actionTime + cd;
            target.addBuff(buff)
        }
        return arr;
    }
}