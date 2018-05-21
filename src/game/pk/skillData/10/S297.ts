class S297 extends SBase {
    constructor() {
        super();
    }

    //预加载
    public preload() {
        MonsterVO.getObject(4).preLoad();
    }


    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        //var num = user.getSkillValue(1);
        var cd = user.getSkillValue(1)*1000;
        //for(var i=0;i<num;i++)
        //{
            var mData = {
                force:owner.force,
                mid:4,
                owner:user.owner,
                atkRota:atkRota,
                x:x,
                y:-25 + Math.random()*50,
                actionTime:PD.actionTime,
                dieTime:PD.actionTime + cd
            }
            PD.addMonster(mData);
        //}
        return [];
    }
}