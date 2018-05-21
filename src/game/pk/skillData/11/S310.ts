class S310 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(31).preLoad();
        MonsterVO.getObject(32).preLoad();
        MonsterVO.getObject(33).preLoad();
        MonsterVO.getObject(34).preLoad();
        MonsterVO.getObject(35).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        var cd = user.getSkillValue(1)*1000;
        for(var i=31;i<=35;i++)
        {
            var mData = {
                force:owner.force,
                mid:i,
                owner:user.owner,
                atkRota:atkRota,
                x:x,
                y:-25 + Math.random()*50,
                actionTime:PD.actionTime,
                dieTime:PD.actionTime + cd
            }
            PD.addMonster(mData);
        }
        return [];
    }
}