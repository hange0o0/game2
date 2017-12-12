class M1 extends MBase{
    constructor() {
        super();
    }

    private mvID = 103;
    public preload(){
        //MonsterVO.getObject(1).preLoad();
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }

    public atkMV(user,target,actionTime,endTime){
        PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    }

    //技能动画
    public skillMV(user,target,actionTime,endTime){
        this.atkMV(user,target,actionTime,endTime)
    }


    public skill(user:PKMonsterData,target){
        var hp = Math.ceil(this.getAtkHp(user,target)*0.5);
        target.beAtkAction({hp:hp,atker:user})
        user.atkAction({hp:hp})
    }
    //对最多3个单位进行一次攻击
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = user.getVO().atkrage + 200;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var des = Math.abs(user.x - target.x);
            if(des<=atkrage)
            {
                target.temp = des;
                list.push(target)
            }
        }
        if(list.length>3)
        {
            ArrayUtil.sortByField(list,['temp','id'],[0,0])
            list.length = 3;
        }
        return list;
    }

    //初始化怪物隐藏属性
    //public initMonster(user:PKMonsterData){
    //    //user.doubleRate = 0.5;
    //    //user.doubleValue = 2;
    //    //user.missRate = 0.5;
    //}

    //public getSkillTarget(user:PKMonsterData){
    //    return [null];
    //}
    //
    //public skill(user:PKMonsterData,targets){
    //    var PD = PKData.getInstance();
    //    var mid = 1;
    //    var owner = PD.getPlayer(user.owner);
    //    var atkRota = owner.teamData.atkRota;
    //    var mData = {
    //        force:owner.force,
    //        mid:mid,
    //        owner:user.owner,
    //        atkRota:atkRota,
    //        x:user.x,
    //        lastSkill:Number.MAX_VALUE,
    //        actionTime:PD.actionTime
    //    }
    //    PD.addMonster(mData);
    //}

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