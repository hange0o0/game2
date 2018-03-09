class S108 extends SBase {
    constructor() {
        super();
    }

    public mvID = 103;

    public preload(){
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    public initSkill(user:PKPosCardData){
        user.needRemoveListener = false
    }


    public onSkill(user:PKPosCardData) {
        var listener = new S108StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        listener.mvID = this.mvID;
        listener.endTime = PKData.getInstance().actionTime + user.getSkillValue(4) *1000;
        listener.x = PKData.getInstance().getFirstX(teamData.id) + teamData.atkRota*(PKData.getInstance().random()*30 + 20);
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
}


class S108StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var user:PKPosCardData = <PKPosCardData>this.owner;

        if(PKData.getInstance().actionTime - this.actionTime < user.getSkillValue(1) *1000)
            return;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = user.getSkillValue(2);
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
            selectTarget.addHp(-user.getSkillValue(3,true))
        }
    }

    public onRemove(){
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_TOTEM_REMOVE,
            user:this
        })
    }
}