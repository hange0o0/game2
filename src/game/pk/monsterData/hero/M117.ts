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
                target.atk += user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user);
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['atk+']
                })
                break;
            case 2:
                target.def += user.getVO().getHeroSkillValue(user.useingHeroSkill,2);
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['def+']
                })
                break;
            case 3:
                target.momian = true
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['momian']
                })
                break;
            case 4:
                target.hpChange += user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user);
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['hp+']
                })
                break;
        }
    }
}