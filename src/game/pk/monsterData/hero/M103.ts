class M103 extends MBase{
    constructor() {
        super();
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var value = user.getVO().getHeroSkillValue(1,1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.value = value;
            buff.id = 103;
            buff.user = user;

            buff.addValue('def',value);
            target.addBuff(buff)
            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['def+']
                })
            }

        }

        var listener = new M103StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            target.cleanBuff(0,user);
        }
        user.getOwner().teamData.removeStateListerByOwner(user)
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b && user.level >= 2)
        {
             target.def -= user.getVO().getHeroSkillValue(2,1);
            if(user.level >= 3)
            {
                if(user.level >= 5)
                    var rd = user.getVO().getHeroSkillValue(5,1);
                else
                    var rd = user.getVO().getHeroSkillValue(3,1);
                if(PKData.getInstance().random()*100 < rd){
                    var isToRight = user.x<target.x
                    var PD = PKData.getInstance();
                    var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
                    var atkRage = user.getVO().getAtkDis() + user.getVO().getHeroSkillValue(3,2);
                    var hurt = user.getVO().getHeroSkillValue(3,3,user);
                    for(var i=0;i<arr.length;i++)
                    {
                        var newTarget = arr[i];
                        if(isToRight)
                        {
                            if(user.x > newTarget.x)
                                continue
                        }
                        else if(user.x < newTarget.x)
                            continue
                        if(!newTarget.canBeAtk(user))
                            continue;
                        var tDes = Math.abs(user.x - newTarget.x);
                        if(tDes > atkRage + newTarget.getVO().width/2)
                            continue;
                        newTarget.beAtkAction({hp:hurt})
                        user.addAtkHurt(hurt)

                        if(user.level >= 4)
                        {
                            var buff = new PKBuffData()
                            buff.value = user.level;
                            buff.isDebuff = true;
                            buff.id = 103 + '_4';
                            buff.user = user;
                            buff.endTime = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(4,1);
                            buff.addState(PKConfig.STATE_YUN);
                            newTarget.addBuff(buff)
                        }
                    }
                }
            }
        }
        return b;
    }
}

class M103StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var mvo = <MonsterVO>this.owner.getVO();
        var value = mvo.getHeroSkillValue(1,1);


        var buff = new PKBuffData()
        buff.value = mvo.level;
        buff.id = 103;
        buff.user = mvo;

        buff.addValue('def',value);
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:['def+'],
            })
        }
    }
}