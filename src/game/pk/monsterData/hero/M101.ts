class M101 extends MBase {
    constructor() {
        super();
    }
    public mvID1 = 103;
    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        if(user.level >= 4)
        {
            user.manaHp +=  user.getVO().getHeroSkill(4).getSkillValue(1,user);
            user.hp = user.manaHp;
        }
        if(user.level >= 5)
            user.hpChange +=  user.getVO().getHeroSkill(5).getSkillValue(1,user);
    }

    public onCreate(user:PKMonsterData){
        if(user.level >= 3)
        {
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData);
            var value = user.getVO().getHeroSkill(3).getSkillValue(1,user);
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                var buff = new PKBuffData()
                buff.id = 101;
                buff.user = user;
                buff.addValue('atk',value);
                target.addBuff(buff)

                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        key:'atk',
                        stateType:1
                    })
                }

            }

            var listener = new M101StateListener();
            listener.owner = user;
            user.getOwner().teamData.addStateLister(listener)
        }
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

    private testTarget(target){
        if(!target.beSkillAble())
            return false;
        return true
    }

    public getSkillTarget(user:PKMonsterData){
        //if(user.callHeroSkill)
        //    return [];
        var PD = PKData.getInstance();
        var list
        if(user.level >= 1 && this.isHeroSkillCDOK(user,1))
        {
            user.callHeroSkill = 1;
            list = PD.getMonsterByTeam(user.getOwner().teamData.enemy,this.testTarget,[user]);
            if(list.length > 0)
                return [ArrayUtil.randomOne(list)];
        }
        if(user.level >= 2 && this.isHeroSkillCDOK(user,2))
        {
            user.callHeroSkill = 2;
            if(!list)
                list = PD.getMonsterByTeam(user.getOwner().teamData.enemy,this.testTarget,[user]);
            return list;
        }
        return [];
    }

    public skill(user:PKMonsterData,target){
        //console.log(user.useingHeroSkill)
        switch(user.useingHeroSkill)
        {
            case 1:
            case 2:
                var hp = user.getVO().getHeroSkill(user.useingHeroSkill).getSkillValue(1,user)
                target.beAtkAction({hp:hp,atker:user})
                user.atkAction({hp:hp})
                break;
        }
    }
}

class M101StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var value = (<MonsterVO>this.owner.getVO()).getHeroSkill(3).getSkillValue(1,this.owner);
        var buff = new PKBuffData()
        buff.id = 101;
        buff.user = this.owner;
        buff.addValue('atk',value);
        target.addBuff(buff)
        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                key:'atk',
                stateType:1
            })
        }
    }
}