class M115 extends MBase{
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        var PD = PKData.getInstance();
        var addRate = user.level >= 4?user.getVO().getHeroSkillValue(4,1)/100:0;
        var dropMid = {1:65,2:2,3:41};
        var dropList = [];
        for(var i=3;i>=1;i--)
        {
            var rate = user.getVO().getHeroSkillValue(i,1)/100 + addRate;
            if(PD.random() < rate)
            {
                dropList.push(dropMid[i])
                if(user.level < 5)
                    break;
            }
        }

        for(var i=0;i<dropList.length;i++)
        {
            var mid = dropList[i];
            var owner = PD.getPlayer(user.owner);
            var atkRota = owner.teamData.atkRota;
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:user.x,
                y:-30 + Math.random()*60,
                lastSkill:Number.MAX_VALUE,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }

        return true;
    }
}