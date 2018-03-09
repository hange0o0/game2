class M35 extends MBase {
    constructor() {
        super();
    }
    public mvID = 103;
    public preload(){
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    public initMonster(user:PKMonsterData){
        user.atkY = -30
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 100;
    }

    public atkMV(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,2)
    }
    public skill(user:PKMonsterData,target:PKMonsterData){
        console.log('skill')
        var listener = new M35StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        listener.mvID = this.mvID;
        listener.endTime = PKData.getInstance().actionTime + user.getSkillValue(2) *1000;
        listener.x = user.x + teamData.atkRota*(PKData.getInstance().random()*30 + 20);
        teamData.addStateLister(listener);

        //加入动画图腾
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_TOTEM_ADD,
            totemType:1,
            user:listener,
            x:listener.x,
            y:-25 + Math.random()*50

        })
        return [];
    }

    public getSkillTarget(user:PKMonsterData){
        if(user.target)
            return [null];
        return [];
    }
}


class M35StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var user:PKPosCardData = <PKPosCardData>this.owner;

        if(PKData.getInstance().actionTime - this.actionTime < 1000)
            return;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = user.getSkillValue(3);
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var targetX = arr[i];
            if(!targetX.beSkillAble())
                continue;
            var des = Math.abs(this.x - targetX.x);
            if(des<=atkrage)
            {
                list.push(targetX)
            }
        }
        var selectTarget = ArrayUtil.randomOne(list);
        if(selectTarget)
        {
            this.actionTime = PKData.getInstance().actionTime;
            PKVideoCon.getInstance().playAniOn(selectTarget.id,this.mvID)
            selectTarget.addHp(-user.getSkillValue(1,true))
        }
    }

    public onRemove(){
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_TOTEM_REMOVE,
            user:this
        })
    }
}