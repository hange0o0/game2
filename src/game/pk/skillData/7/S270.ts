class S270 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var player = user.getOwner()
        player.teamData.enemy.hp -= user.getSkillValue(1);
        PD.addVideo({
            type:PKConfig.VIDEO_TEAM_HP_CHANGE
        })
        if(player.teamData.enemy.hp <=0)
            PD.isGameOver = true;
        return [];
    }
}