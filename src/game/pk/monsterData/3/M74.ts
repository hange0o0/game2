class M74 extends MBase {
    constructor() {
        super();
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 64;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var num = user.getSkillValue(1)
        for(var i=0;i<num;i++)
        {
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:user.x,
                y:-25 + Math.random()*50,
                lastSkill:Number.MAX_VALUE,
                dieTime:PD.actionTime + user.getSkillValue(2)*1000,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }

    }
}