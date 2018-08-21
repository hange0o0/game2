class M117 extends MBase{
    constructor() {
        super();
    }

    private testTarget(target:PKMonsterData,value){
        var user:PKMonsterData = value[0]
        var skillID = value[1]
        var range = value[2]
        if(Math.abs(user.x - target.x) > range)
            return false
        if(skillID == 2 && target.def > 60)
            return false;
        if(skillID == 3 && target.isInState(PKConfig.STATE_MOMIAN))
            return false;
        return true
    }

    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var list
        if(user.level >= 1 && this.isHeroSkillCDOK(user,1))
        {
            user.callHeroSkill = 1;
            list = PD.getMonsterByTeam(user.getOwner().teamData,this.testTarget,[user,1,user.getVO().getHeroSkillValue(1,1)]);
            if(list.length > 0)
                return this.resetSkillTarget(user,list);
        }
        if(user.level >= 2 && this.isHeroSkillCDOK(user,2))
        {
            user.callHeroSkill = 2;
            list = PD.getMonsterByTeam(user.getOwner().teamData,this.testTarget,[user,2,user.getVO().getHeroSkillValue(2,1)]);
            if(list.length > 0)
                return this.resetSkillTarget(user,list);
        }
        if(user.level >= 3 && this.isHeroSkillCDOK(user,3))
        {
            user.callHeroSkill = 3;
            list = PD.getMonsterByTeam(user.getOwner().teamData,this.testTarget,[user,3,user.getVO().getHeroSkillValue(3,1)]);
            if(list.length > 0)
                return this.resetSkillTarget(user,list);
        }
        if(user.level >= 4 && this.isHeroSkillCDOK(user,4))
        {
            user.callHeroSkill = 4;
            list = PD.getMonsterByTeam(user.getOwner().teamData,this.testTarget,[user,4,user.getVO().getHeroSkillValue(4,1)]);
            if(list.length > 0)
                return this.resetSkillTarget(user,list);
        }
        return [];
    }

    private resetSkillTarget(user,arr){
        var list = [PKData.getInstance().randomOne(arr,true)]
        if(user.level >= 5 && arr.length > 0 && PKData.getInstance().random()*100 < user.getVO().getHeroSkillValue(5,1))
            list.push(PKData.getInstance().randomOne(arr,true))
        return list
    }

    public skill(user:PKMonsterData,target){
        //console.log(user.useingHeroSkill)
        switch(user.useingHeroSkill)
        {
            case 1:
                var buff = new PKBuffData()
                buff.value = user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user);
                buff.id = '117_1';
                buff.user = user;
                buff.addValue('atk',buff.value);
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
                break;
            case 2:
                var buff = new PKBuffData()
                buff.value = user.getVO().getHeroSkillValue(user.useingHeroSkill,2);
                buff.id = '117_2';
                buff.user = user;
                buff.addValue('def',buff.value);
                target.addBuff(buff)
                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        key:'def',
                        stateType:1
                    })
                }
                break;
            case 3:
                var buff = new PKBuffData()
                buff.value = 1;
                buff.id = '117_3';
                buff.user = user;
                buff.addState(PKConfig.STATE_MOMIAN);
                target.addBuff(buff)
                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        key:'momian',
                        stateType:0
                    })
                }
                break;
            case 4:
                var buff = new PKBuffData()
                buff.value = user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user);
                buff.id = '117_4';
                buff.user = user;
                buff.addValue('hpChange',buff.value);
                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        key:'hp',
                        stateType:1
                    })
                }
                break;
        }
    }
}