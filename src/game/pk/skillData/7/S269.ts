class S269 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 166;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var player = user.getOwner()
        player.teamData.enemy.hp -= user.getSkillValue(1);
        PD.addVideo({
            type:PKConfig.VIDEO_TEAM_HP_CHANGE,
            addHp:false,
            user:player
        })
        AtkMVCtrl.getInstance().hpSkillMV(269,player.teamData.enemy,1)
        if(player.teamData.enemy.hp <=0)
            PD.isGameOver = true;
        return [];
    }
}