class S502 extends SBase {
    constructor() {
        super();
    }
    public mvID1 = 166;
    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var player = user.getOwner()
        if(!player.skillValue[502])
        {
            player.skillValue[502] = true;
            return
        }
        AtkMVCtrl.getInstance().hpSkillMV(268,player.teamData,1)
        player.teamData.hp -= 1
        PD.addVideo({
            type:PKConfig.VIDEO_TEAM_HP_CHANGE,
            addHp:false,
            toSelf:true,
            user:player
        })
        if(player.teamData.hp <=0)
            PD.isGameOver = true;
        return [];
    }
}