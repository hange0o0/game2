class M1 extends MBase{
    constructor() {
        super();
    }

    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        //user.doubleRate = 0.5;
        //user.doubleValue = 2;
        //user.missRate = 0.5;
    }

    public getSkillTarget(user:PKMonsterData){
        return [null];
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 1;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            lastSkill:Number.MAX_VALUE,
            actionTime:PD.actionTime
        }
        PD.addMonster(mData);
    }

    //public atk(user:PKMonsterData,target:PKMonsterData){
    //    super.atk(user,target);
    //    //溅射 30%
    //    var isToRight = user.x<target.x
    //    var PD = PKData.getInstance();
    //    var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
    //    var atkRage = user.getVO().atkrage + 200;
    //    for(var i=0;i<arr.length;i++)
    //    {
    //        var newTarget = arr[i];
    //        if(newTarget == target)
    //            continue;
    //        if(isToRight)
    //        {
    //            if(user.x > newTarget.x)
    //                continue
    //        }
    //        else if(user.x < newTarget.x)
    //            continue
    //        if(!newTarget.canBeAtk(user))
    //            continue;
    //        var tDes = Math.abs(user.x - newTarget.x);
    //        if(tDes > atkRage + newTarget.getVO().width/2)
    //            continue;
    //
    //        var hp = this.getAtkHp(user,newTarget);
    //        newTarget.beAtkAction({hp:Math.ceil(hp*0.3)})
    //    }
    //}

}