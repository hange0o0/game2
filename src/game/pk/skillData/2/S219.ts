class S219 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var cd = user.getSkillValue(2)*1000;
        var rate = user.getSkillValue(1)/100;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.user = user;
            buff.removeAble = false
            buff.id = 219;
            buff.value = rate;
            buff.endTime = PD.actionTime + cd;
            buff.addValue('atk',target.baseAtk*rate)
            buff.addValue('addSpeed',user.getSkillValue(1))
            buff.addState(PKConfig.STATE_MOMIAN);
            buff.endFun = function(buff:PKBuffData){
                buff.owner.setDie();
            }
            target.addBuff(buff)

            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:['momian','atk+','speed+']
            })
        }
        return arr;
    }

}