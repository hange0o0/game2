class M106 extends MBase{
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkRage = user.getVO().getHeroSkillValue(1,1);
        if(user.level >= 5)
            atkRage = user.getVO().getHeroSkillValue(5,1);
        var defValue = user.getVO().getHeroSkillValue(1,2);
        var cd = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(1,3);
        if(user.level >= 2)
            var hurt = user.getVO().getHeroSkillValue(2,2,user);
        if(user.level >= 3)
            var heal = user.getVO().getHeroSkillValue(3,1,user);
        for(var i=0;i<arr.length;i++)
        {
            var newTarget = arr[i];
            if(!newTarget.beSkillAble())
                continue;
            var tDes = Math.abs(user.x - newTarget.x);
            if(tDes > atkRage + newTarget.getVO().width/2)
                continue;

            var buff = new PKBuffData()
            buff.value = user.level;
            buff.isDebuff = true;
            buff.id = 106;
            buff.user = user;
            buff.endTime = cd;
            buff.addState(PKConfig.STATE_ILL);

            var keys = ['def-']
            buff.addValue('def',-defValue);
            if(user.level>=2)
            {
                buff.addValue('hpChange',-hurt);
                keys.push('hp-')
            }
            if(user.level>=3)
            {
                buff.addState(PKConfig.STATE_DIE);
                buff.tempValue[106] = heal
            }
            newTarget.addBuff(buff)


            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:newTarget,
                    keys:keys,
                })
            }
        }
        return true;
    }

    public onBuff(buff:PKBuffData){
        var user:PKMonsterData = buff.user
        if(user.die)
            return;
        user.addHp(buff.tempValue[106])
    }

    public getSkillTarget(user:PKMonsterData){
        if(user.level>=4  && this.isHeroSkillCDOK(user,4))
        {
            user.callHeroSkill = 4;
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            var list = [];
            for(var i=0;i<arr.length;i++)
            {
                var newTarget = arr[i];
                if(!newTarget.haveBuff(106))
                    continue;
                list.push(newTarget)
            }
            return list;
        }
        return [];
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 4)
        {
            var hurt = user.getVO().getHeroSkillValue(4,1,user);
            target.beAtkAction({hp:hurt})
            user.addAtkHurt(hurt)
            user.addHp(hurt)
        }
    }
}