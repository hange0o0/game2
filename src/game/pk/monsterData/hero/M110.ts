class M110 extends MBase{
    constructor() {
        super();
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var value = user.getVO().getHeroSkillValue(1,1)/100;
        if(user.level >= 2)
            var value2 = user.getVO().getHeroSkillValue(2,1);
        if(user.level >= 3)
            var value3 = user.getVO().getHeroSkillValue(3,1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.id = 110;
            buff.user = user;
            buff.value = user.baseHp;
            if(target.getVO().isNearAtk())
            {
                if(value3)
                {
                    buff.addValue('def',value3);
                    var keys = ['def+']
                }
                else
                    continue;
            }
            else
            {
                var keys = ['atk+']
                buff.addValue('atk',Math.ceil(value*target.baseAtk));
                if(user.level >= 2)
                {
                    buff.addValue('addSpeed',value2);
                    keys.push('speed+')
                }
            }
            target.addBuff(buff)
            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:keys
                })
            }

        }

        var listener = new M110StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)

        if(user.level >= 5)
            user.getOwner().teamData.toFront ++;
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

    public getSkillTarget(user:PKMonsterData){
        if(user.level >= 4 && this.isHeroSkillCDOK(user,4))
        {
            user.callHeroSkill = 4;
            return [null];
        }
        return []
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 4)
        {
            var cd = user.getVO().getHeroSkillValue(4,1)*1000;
            for(var s in user.getOwner().posCard)
            {
                var posCard:PKPosCardData = user.getOwner().posCard[s]
                if(posCard && posCard.mid < PKConfig.skillBeginID && posCard.num>0)
                {
                    posCard.actionTime -= cd;
                }
            }
        }
    }

    public onDie(user:PKMonsterData){
        if(user.level >= 5)
            user.getOwner().teamData.toFront --;
    }
}

class M110StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){



        var user:PKMonsterData = <PKMonsterData>this.owner
        //var mvo = <MonsterVO>this.owner.getVO();


        var buff = new PKBuffData()
        buff.value = user.baseHp;
        buff.id = 110;
        buff.user = user;
        if(target.getVO().isNearAtk())
        {
            if(user.level >= 3)
            {
                buff.addValue('def',user.getVO().getHeroSkillValue(3,1));
                var keys = ['def+']
            }
            else
                return;
        }
        else
        {
            var keys = ['atk+']
            buff.addValue('atk',Math.ceil(user.getVO().getHeroSkillValue(1,1)/100*target.baseAtk));
            if(user.level >= 2)
            {
                buff.addValue('addSpeed',user.getVO().getHeroSkillValue(2,1));
                keys.push('speed+')
            }
        }
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:keys
            })
        }
    }
}