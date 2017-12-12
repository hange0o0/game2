class M9 extends MBase {
    constructor() {
        super();
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.id = 9;
            buff.user = user;
            buff.addValue('atk',Math.min(1,Math.floor(target.baseAtk*0.2)));
            target.addBuff(buff)



            if(buff.ing)
            {

                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    key:1,
                    stateType:1
                })
            }

        }

        var listener = new M9StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onDie(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            target.cleanBuff(0,user);
        }
        user.getOwner().teamData.removeStateListerByOwner(user)
    }
}

class M9StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target:PKMonsterData){
        var buff = new PKBuffData()
        buff.id = 9;
        buff.user = this.owner;
        buff.addValue('atk',Math.min(1,Math.floor(target.baseAtk*0.2)));
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                key:1,
                stateType:1
            })
        }
    }
}