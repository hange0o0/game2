class MSBase {
    private static baseData = {};
    public static getData(id):MSBase{
        if(!this.baseData[id])
        {
            var myClass = eval("MS" + id);
            this.baseData[id] = new myClass();
        }
        return this.baseData[id];
    }



    public vo:MonsterVO
    public type = 'monster'
    constructor() {
    }

    //a对B攻击到达
    public atk(user:PKMonsterData,target:PKMonsterData){
        var hp = this.getAtkHp(user,target);
        target.beAtkAction({hp:hp})
        user.atkAction({hp:hp})
    }

    //攻击动画
    public atkMV(item:PKMonsterItem,mvData){

    }

    //攻击前处理（生成PK事件）
    public atkBefore(user:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime + user.getVO().atkcd / 2//这个时间后发出攻击时件
        this.sendAtkBefore(user,target,actionTime,endTime)
    }

    //攻击发出处理
    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime //这个时间攻击生效
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }




   //////////////////////////////////////////////////////
    protected getAtkHp(user:PKMonsterData,target:PKMonsterData){
        var atk = user.atk * user.getAtkRate(target);
        var hp = Math.floor(atk * (1-target.def/100));
        if(hp < 1)
            hp = 1;
        return hp;
    }

    protected sendAtkBefore(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'before',
            model:this,
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })
    }

    protected sendAtkAction(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'atk',
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })

        PKData.getInstance().addVideo({
            type:'monster_atk_action',
            user:user,
            target:target,
            actionTime:actionTime,
            endTime:endTime
        })
    }
}