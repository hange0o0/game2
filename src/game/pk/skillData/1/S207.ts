class S207 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(1).preLoad();
        MonsterVO.getObject(2).preLoad();
        MonsterVO.getObject(3).preLoad();
        MonsterVO.getObject(4).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        for(var i=1;i<=4;i++)
        {
            var mData = {
                force:owner.force,
                mid:i,
                owner:user.owner,
                atkRota:atkRota,
                x:x,
                y:-25 + Math.random()*50,
                actionTime:PD.actionTime,
                dieTime:PD.actionTime + user.getSkillValue(1)*1000
            }
            PD.addMonster(mData);
        }
        return [];

    }
}
