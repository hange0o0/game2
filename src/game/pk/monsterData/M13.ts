class M13 extends MBase {
    constructor() {
        super();
    }

    //攻击前处理（生成PK事件）设攻击发出时间，攻击目标选择
    public atkBefore(user:PKMonsterData,actionTime){
        user.addHp(-Number.MAX_VALUE);


        var listener = new M13StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }
}

class M13StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    public x
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
        this.x = this.owner['x'];
        this.endTime = this.actionTime + this.owner.getSkillValue(3)*1000
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(PKData.getInstance().actionTime - this.actionTime < 500)
            return;
        this.actionTime = PKData.getInstance().actionTime;

        var user = this.owner;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = user.getSkillValue(1)/2;
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            var des = Math.abs(this.x - targetEnemy.x);
            if(des<=atkrage)
            {
                targetEnemy.addHp(-user.getSkillValue(2))
            }
        }
        return list;
    }
}