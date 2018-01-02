class M38 extends MBase {
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        user.atkY = 10
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x)*2 + 100;
    }

    public atkMV(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,9)
    }

    //技能动画
    public skillMV(user,target,actionTime,endTime){
        this.atkMV(user,target,actionTime,endTime)
    }

    protected getSkillArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x)*2 + 100;
    }

    public skill(user:PKMonsterData,target){
        var hp = Math.ceil(this.getAtkHp(user,target));
        target.beAtkAction({hp:hp,atker:user})
        user.atkAction({hp:hp})
    }

    //对最多3个单位进行一次攻击
    public getSkillTarget(user:PKMonsterData){
        if(user.target)
            return [user.target];
        return [];
    }

    //技能前处理（生成技能事件）
    public skillBefore(user:PKMonsterData,actionTime){
        var endTime = actionTime + user.getVO().mv_atk//这个时间后发出攻击时件(前摇)
        var target = this.getSkillTarget(user)[0];
        var times = user.getSkillValue(1);
        for(var i=0;i<times;i++)
        {
            this.sendSkillBefore(user,target,actionTime,endTime + i*100)
        }
    }
}