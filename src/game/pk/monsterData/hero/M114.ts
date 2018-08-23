class M114 extends MBase{
    constructor() {
        super();
    }
    public mvID1 = 166;
    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.skillTemp[114] = 0
        user.missRate =  user.getVO().getHeroSkillValue(1,1)/100;
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        user.skillTemp[114]++;
        var PD = PKData.getInstance();
        if(user.level >=4 && PD.random()*100 < user.getVO().getHeroSkillValue(4,1))
        {
            var mid = 114;
            var owner = PD.getPlayer(user.owner);
            var atkRota = owner.teamData.atkRota;
            var mData = {
                force:owner.force*user.getVO().getHeroSkillValue(4,2)/100,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:user.x,
                y:-30 + Math.random()*60,
                lastSkill:Number.MAX_VALUE,
                dieTime:PD.actionTime + user.getVO().getHeroSkillValue(4,3)/100,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }
        this.testSkill(user,target)
        return true;
    }

    public getSkillTarget(user:PKMonsterData){
        if(user.level >= 2 && user.skillTemp[114] > 0 && user.skillTemp[114]%user.getVO().getHeroSkillValue(2,1) == 0)
        {
            user.callHeroSkill = 2;
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData);
            var atkrage = user.getVO().getHeroSkillValue(2,3);
            var selectTarget
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                if(target.getVO().isHero())
                    continue;
                var des = Math.abs(user.x - target.x);
                if(des<=atkrage)
                {
                    target.temp = target.hp;
                    if(!selectTarget || selectTarget.temp > target.temp)
                        selectTarget = target
                }
            }
            if(selectTarget)
            {
                return [selectTarget]
            }
        }
        if(user.level >= 3 && user.skillTemp[114] > 0 && user.skillTemp[114]%user.getVO().getHeroSkillValue(3,1) == 0)
        {
            user.callHeroSkill = 3;
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData);
            var atkrage = user.getVO().getHeroSkillValue(3,3);
            var selectTarget
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                if(target.getVO().isHero())
                    continue;
                var des = Math.abs(user.x - target.x);
                if(des<=atkrage)
                {
                    target.temp = target.hp;
                    if(!selectTarget || selectTarget.temp < target.temp)
                        selectTarget = target
                }
            }
            if(selectTarget)
            {
                return [selectTarget]
            }
        }

        return [];
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 2)
        {
            var hp = user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user)
            target.beAtkAction({hp:hp,atker:user})
            user.addAtkHurt(hp)
            this.testSkill(user,target)
        }
        else if(user.useingHeroSkill == 3)
        {
            var hp = user.getVO().getHeroSkillValue(user.useingHeroSkill,2,user)
            target.beAtkAction({hp:hp,atker:user})
            user.addAtkHurt(hp)
            this.testSkill(user,target)
        }
    }

    private testSkill(user,target){
        if(user.level >=5 && target.die)
        {
            user.addSpeed += user.getVO().getHeroSkillValue(5,1)
        }
    }
}