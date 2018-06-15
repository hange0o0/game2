class S265 extends SBase {
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

        AtkMVCtrl.getInstance().hpSkillMV(265,player.teamData,0.8)

        //if(PKVideoCon.getInstance().stage)
        //{
        //    var mc = player.teamData.atkRota == PKConfig.ROTA_LEFT?PKTopUI.getInstance().hpGroup1:PKTopUI.getInstance().hpGroup2
        //    var AM = AniManager.getInstance();
        //    var mvMC = AM.playOnItem(this.mvID1,mc,{x:mc.x + mc.width/2,y:mc.y + mc.height/2});
        //    if(mvMC)
        //        mvMC.scaleX = mvMC.scaleX = 0.8
        //}


        return [];
    }
}