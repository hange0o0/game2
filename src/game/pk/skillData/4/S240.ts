class S240 extends SBase {
    constructor() {
        super();
    }
    public onSkill(user:PKPosCardData) {
        var listener = new S240StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        listener.mvID = this.mvID1;
        listener.addValue = user.getSkillValue(1,true);
        listener.endTime = PKData.getInstance().actionTime + user.getSkillValue(2) *1000;
        teamData.addStateLister(listener);
        return [];
    }


}


class S240StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    public addValue
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(target.skillTemp[240])
            return;
        if(target.getOwner().teamData != this.owner.getOwner().teamData)
            return;
        target.skillTemp[240] = true;

        target.def += this.addValue
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            key:'def',
            stateType:1
        })
    }
}