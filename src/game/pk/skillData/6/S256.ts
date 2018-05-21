class S256 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var value = user.getSkillValue(1,true);
        var cd = user.getSkillValue(2)*1000
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];

            var buff = new PKBuffData()
            buff.id = 256;
            buff.value = value;
            buff.user = user;
            buff.addValue('hpChange',value);
            buff.endTime = PKData.getInstance().actionTime + cd;
            target.addBuff(buff)
        }
        return arr;
    }
}