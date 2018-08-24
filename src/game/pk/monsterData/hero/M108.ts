class M108 extends MBase{
    constructor() {
        super();
    }

    public mvID1 = 103;
    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var value = user.getVO().getHeroSkillValue(1,1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.value = value;
            buff.id = 108;
            buff.user = user;

            buff.addValue('addSpeed',value);
            target.addBuff(buff)


            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['speed+']
                })
            }

        }

        var listener = new M108StateListener();
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

    private testTarget(target){
        if(!target.beSkillAble())
            return false;
        return true
    }
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var list
        if(user.level >= 2 && this.isHeroSkillCDOK(user,2))
        {
            user.callHeroSkill = 2;
            list = PD.getMonsterByTeam(user.getOwner().teamData.enemy,this.testTarget,[user]);
            if(list.length > 0)
                return [PKData.getInstance().randomOne(list)];
        }
        if(user.level >= 3 && this.isHeroSkillCDOK(user,3))
        {
            user.callHeroSkill = 3;
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
            case 2:
                var hp = user.getVO().getHeroSkillValue(user.useingHeroSkill,1,user)
                target.beAtkAction({hp:hp,atker:user})
                user.addAtkHurt(hp)

                this.testAddHp(user,hp)

                var buff = new PKBuffData()
                buff.user = user;
                buff.isDebuff = true;
                buff.addState(PKConfig.STATE_YUN);
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(user.useingHeroSkill,2);
                target.addBuff(buff)
                break;
            case 3:
                //PKData.getInstance().actionRecord.push('skill|' + PKData.getInstance().actionTime+'|' + user.id+'|'+target.id)
                var hp = PKData.getInstance().rand(user.getVO().getHeroSkillValue(user.useingHeroSkill,1,user),
                    user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user))
                target.beAtkAction({hp:hp,atker:user})
                user.addAtkHurt(hp)
                this.testAddHp(user,hp)
                break;
        }
    }

    //被攻击时的处理
    public beAtkAction(user,data){
        if(user.level < 4)
            return;
        var target = data.atker
        if(target && PKData.getInstance().random()*100 < user.getVO().getHeroSkillValue(4,1))
        {
            if(target.beSkillAble())
            {
                var hp = user.getVO().getHeroSkillValue(4,2,user)
                target.beAtkAction({hp:hp})
                user.addAtkHurt(hp)
                this.testAddHp(user,hp)


                var skillValue = user.getVO().getHeroSkillValue(4,3);
                var buff = new PKBuffData()
                buff.id = '108_4';
                buff.isDebuff = true;
                buff.value = skillValue;
                buff.addValue('addSpeed',-skillValue);
                buff.user = user;
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(4,4);
                target.addBuff(buff)

                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        keys:['speed-']
                    })
                }
            }
        }
    }

    private testAddHp(user:PKMonsterData,hp){
        if(user.level >= 5)
            user.addHp(Math.ceil(hp*user.getVO().getHeroSkillValue(5,1)/100));
    }
}

class M108StateListener extends PKStateListener {
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
        buff.id = 108;
        buff.user = mvo;

        buff.addValue('addSpeed',value);
        target.addBuff(buff)


        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:['speed+']
            })
        }
    }
}