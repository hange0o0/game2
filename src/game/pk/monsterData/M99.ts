class M99 extends MBase{
    constructor() {
        super();
    }

    public beAtkAction(user,data){
        data.atker.getOwner().teamData.def ++;
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_TEAM_DEF,
            user:data.atker
        })
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ATK,
            user:user
        })

    }
}