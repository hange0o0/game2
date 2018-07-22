class S324 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var addValue = user.getSkillValue(1,true);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var type = 'atk'
            target.atk += addValue

            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                key:type,
                stateType:1
            })
        }
        return arr;
    }
}