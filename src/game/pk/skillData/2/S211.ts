class S211 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 103;

    //预加载
    public preload() {
        super.preload()
        MonsterVO.getObject(65).preLoad();
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData){

        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var list = []
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(!target.beSkillAble())
                continue;
            list.push(target)

        }
        var item = PD.randomOne(list)
        if(!item)
            return []

        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;

        var num = user.getSkillValue(1);
        var cd = user.getSkillValue(2)*1000;
        for(var i=0;i<num;i++)
        {
            var x = item.x + PD.random()*100 - 50;
            var mData = {
                force:owner.force,
                mid:65,
                owner:user.owner,
                atkRota:atkRota,
                x:x,
                y:-25 + Math.random()*50,
                lastSkill:Number.MAX_VALUE,
                actionTime:PD.actionTime,
                dieTime:PD.actionTime + cd
            }
            PD.addMonster(mData);
        }

        item.setDie();

        return [item];

    }
}