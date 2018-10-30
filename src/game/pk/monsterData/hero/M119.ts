class M119 extends MBase{
    constructor() {
        super();
    }

    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var list
        if(user.level >= 1 && this.isHeroSkillCDOK(user,1))
        {
            list = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            var enemy
            var dec = user.getVO().getHeroSkillValue(1,1);
            for(var i=0;i<list.length;i++)
            {
                var target = list[i];
                if(!target.beSkillAble())
                    break;
                if(Math.abs(target.x - user.x) > dec)
                    break;
                if(!enemy || enemy.atk < target.atk)
                    enemy = target;
            }
            if(enemy)
            {
                user.callHeroSkill = 1;
                return [enemy];
            }
        }
        if(user.level >= 2 && this.isHeroSkillCDOK(user,2))
        {
            list = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            var enemy
            var dec = user.getVO().getHeroSkillValue(2,1);
            for(var i=0;i<list.length;i++)
            {
                var target = list[i];
                if(!target.beSkillAble())
                    break;
                if(Math.abs(target.x - user.x) > dec)
                    break;
                if(!enemy || enemy.def < target.def)
                    enemy = target;
            }
            if(enemy)
            {
                user.callHeroSkill = 1;
                return [enemy];
            }
        }
        return [];
    }


    public skill(user:PKMonsterData,target){
        //console.log(user.useingHeroSkill)
        var PD = PKData.getInstance();
        switch(user.useingHeroSkill)
        {
            case 1:
                var v = user.getVO().getHeroSkillValue(1,2,user);
                target.atk -= v;
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['atk-']
                })

                if(user.level >= 3)
                {
                    var list = PD.getMonsterByTeam(user.getOwner().teamData);
                    var self = PD.randomOne(list)
                    self.atk += v;

                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:self,
                        keys:['atk+']
                    })
                }

                this.cleanSkillCD(user);

                break;
            case 2:
                var v = user.getVO().getHeroSkillValue(2,2);
                target.def -= v;
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['def-']
                })

                if(user.level >= 4)
                {
                    var list = PD.getMonsterByTeam(user.getOwner().teamData);
                    var self = PD.randomOne(list,true)
                    while(self && self.def >= 70)
                    {
                        self = PD.randomOne(list,true)
                    }
                    if(self)
                    {
                        self.def += v;
                        PKData.getInstance().addVideo({
                            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                            user:self,
                            keys:['def+']
                        })
                    }

                }

                this.cleanSkillCD(user);
                break;
        }
    }

    private cleanSkillCD(user){
        if(user.level >= 5 && PKData.getInstance().random() *100 < user.getVO().getHeroSkillValue(5,1))
        {
            user.skillTemp['hs' + 1] = 0;
            user.skillTemp['hs' + 2] = 0;
        }
    }

}