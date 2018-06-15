class S266 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 30;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var player = user.getOwner()
        player.teamData.hp += user.getSkillValue(1);
        PD.addVideo({
            type:PKConfig.VIDEO_TEAM_HP_CHANGE,
            addHp:true,
            user:player
        })

        AtkMVCtrl.getInstance().hpSkillMV(266,player.teamData,0.8)
        return [];
    }
}