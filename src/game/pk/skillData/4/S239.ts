class S239 extends SBase {
    constructor() {
        super();
    }
    public onSkill(user:PKPosCardData) {
        var listener = new S239StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        listener.mvID = this.mvID1;
        listener.addValue = user.getSkillValue(1,true);
        listener.endTime = PKData.getInstance().actionTime + user.getSkillValue(2) *1000;
        teamData.addStateLister(listener);
        return [];
    }


}


class S239StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    public addValue
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(target.skillTemp[239])
            return;
        if(target.getOwner().teamData != this.owner.getOwner().teamData)
            return;
        target.skillTemp[239] = true;

        target.atk += this.addValue
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            key:'atk',
            stateType:1
        })
    }
}