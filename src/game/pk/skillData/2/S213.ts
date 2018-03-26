class S213 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var listener = new S213StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        teamData.addStateLister(listener);
        user.enableMaxNum = user.getSkillValue(1)
        return [];
    }
}

class S213StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE_POS
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(target.getOwner() != this.owner.getOwner())
            return;
        var PD = PKData.getInstance();
        if(PD.disableKey['213_'  + target.id])
            return;
        var user:PKPosCardData = <PKPosCardData>this.owner
        if(user.enableNum >= user.enableMaxNum)
            return;
        user.enableNum += target.getVO().space;

        PD.disableKey['213_' + target.id] = true;


        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        var mData = {
            force:owner.force,
            mid:target.mid,
            owner:user.owner,
            atkRota:atkRota,
            x:x,
            y:-25 + Math.random()*50,
            actionTime:PD.actionTime
        }

        PD.addMonster(mData);
    }



}