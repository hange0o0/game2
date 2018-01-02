class M65 extends MBase {
    constructor() {
        super();
    }

    public getSkillTarget(user:PKMonsterData){
        return [null];
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 65;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            y:-25 + Math.random()*50,
            lastSkill:Number.MAX_VALUE,
            dieTime:PD.actionTime + user.getSkillValue(1)*1000,
            actionTime:PD.actionTime
        }
        PD.addMonster(mData);
    }
}