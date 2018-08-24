class M109 extends MBase{
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        if(user.level >= 3)
        {
            user.doubleRate = user.getVO().getHeroSkillValue(3,1)/100;
            user.doubleValue = user.getVO().getHeroSkillValue(3,2)/100;
        }
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var value = user.getVO().getHeroSkillValue(1,1)/100;
        if(user.level >= 2)
            var value2 = user.getVO().getHeroSkillValue(2,1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.getVO().isNearAtk())
                continue
            var buff = new PKBuffData()
            buff.value = Math.ceil(value*target.baseAtk);
            buff.id = 109;
            buff.user = user;

            var keys = ['atk+']
            buff.addValue('atk',buff.value);
            if(user.level >= 2)
            {
                buff.addValue('addSpeed',value2);
                keys.push('speed+')
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

    public getSkillTarget(user:PKMonsterData){
        if(user.level >= 4 && user.getHpRate()*100 <= user.getVO().getHeroSkillValue(4,1) && this.isHeroSkillCDOK(user,4))
        {
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData);
            var atkrage = user.getVO().getHeroSkillValue(4,2);
            var selectTarget
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                if(target.getVO().isHero())
                    continue;
                var des = Math.abs(user.x - target.x);
                if(des<=atkrage)
                {
                    target.temp = des;
                    if(!selectTarget || selectTarget.temp > target.temp)
                        selectTarget = target
                }
            }
            if(selectTarget)
            {
                user.callHeroSkill = 4;
                return [selectTarget]
            }
            return [];
        }
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 4)
        {
            user.addHp(target.hp);
            target.setDie();
            if(!user.skillTemp[109])
                user.skillTemp[109] = [];
            user.skillTemp[109].push(target.mid)
        }
    }

    public onDie(user:PKMonsterData){
        if(!user.skillTemp[109])
            return;
        var PD = PKData.getInstance();
        var arr = user.skillTemp[109];
        var cd = PD.actionTime + user.getVO().getHeroSkillValue(5,1)*1000;
        for(var i=0;i<arr.length;i++)
        {
            var mid = arr[i];
            var owner = PD.getPlayer(user.owner);
            var atkRota = owner.teamData.atkRota;
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:user.x,
                y:-30 + Math.random()*60,
                dieTime:cd,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }
    }
}

class M109StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(target.getVO().isNearAtk())
            return


        var user:PKMonsterData = <PKMonsterData>this.owner
        var mvo = <MonsterVO>this.owner.getVO();
        var value = mvo.getHeroSkillValue(1,1)/100;

        var buff = new PKBuffData()
        buff.value = Math.ceil(value*target.baseAtk);
        buff.id = 109;
        buff.user = user;


        var keys = ['atk+']
        buff.addValue('atk',buff.value);
        if(user.level >= 2)
        {
            buff.addValue('addSpeed',user.getVO().getHeroSkillValue(2,1));
            keys.push('speed+')
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