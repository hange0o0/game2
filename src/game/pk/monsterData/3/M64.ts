class M64 extends MBase {
    constructor() {
        super();
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }

    public atkMV(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createArrow(userItem,targetItem,actionTime,endTime)
    }



    //伤害飞行时间
    protected getSkillArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }

    //技能动画
    public skillMV(user,target,actionTime,endTime){
        this.atkMV(user,target,actionTime,endTime)
    }

    //对最多5个单位进行一次攻击
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = user.getVO().atkrage + 50;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var des = Math.abs(user.x - target.x);
            if(des<=atkrage + target.width/2)
            {
                target.temp = des;
                list.push(target)
            }
        }
        var max = user.getSkillValue(1);
        if(list.length>max)
        {
            //ArrayUtil.sortByField(list,['temp'],[0])
            list.length = max;
        }
        return list;
    }

    public skill(user:PKMonsterData,target){
       this.atk(user,target);
    }
}