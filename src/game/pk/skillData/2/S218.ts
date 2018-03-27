class S218 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var md:PKMonsterData = PD.monsterList[i];
            if(md.beSkillAble())
            {
                md.x = md.atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_MOVE,
                    user:md
                })
            }
        }
        return [];
    }
}