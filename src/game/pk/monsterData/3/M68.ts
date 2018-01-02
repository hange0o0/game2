class M68 extends MBase {
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b)
        {
            var buff = new PKBuffData()
            buff.user = user;
            buff.addState(PKConfig.STATE_YUN);
            buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(1);
            target.addBuff(buff)
        }
        return b;
    }
}