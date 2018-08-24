class S237 extends SBase {
    constructor() {
        super();
    }
    public onSkill(user:PKPosCardData) {
        var listener = new S237StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        listener.mvID = this.mvID1;
        listener.addValue = user.getSkillValue(1);
        listener.endTime = PKData.getInstance().actionTime + user.getSkillValue(2) *1000;
        teamData.addStateLister(listener);
        return [];
    }


}


class S237StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    public addValue
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(target.skillTemp[237])
            return;
        //if(target.getOwner().teamData != this.owner.getOwner().teamData)
        //    return;
        target.skillTemp[237] = true;

        target.def += this.addValue
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            keys:['def+']
        })

    }
}