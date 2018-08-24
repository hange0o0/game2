class M113 extends MBase{
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        var keys =  ['atk+']
        if(user.level >= 1)
        {
            user.atk +=  Math.max(1,Math.floor(user.baseAtk*user.getVO().getHeroSkillValue(1,1)/100));
        }
        if(user.level >= 2)
        {
            user.addSpeed +=  user.getVO().getHeroSkillValue(2,1);
            keys.push('speed+')
        }
        if(user.level >= 3)
        {
            user.doubleRate = user.getVO().getHeroSkillValue(3,1)/100;
            user.doubleValue = user.getVO().getHeroSkillValue(3,2)/100;
        }

        //不可以，这时还没加到舞台上
        //PKData.getInstance().addVideo({
        //    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
        //    user:user,
        //    keys:keys
        //})
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        if(user.level >= 5)
        {
            var hp = this.getAtkHp(user,target)
            user.addHp(Math.ceil(hp/100*user.getVO().getHeroSkillValue(5,1)));
        }

        if(user.level >= 4 && PKData.getInstance().random()*100 < user.getVO().getHeroSkillValue(4,1))
        {
            var skillValue = user.getVO().getHeroSkillValue(4,2)
            var buff = new PKBuffData()
            buff.id = '113';
            buff.value = skillValue;
            buff.addValue('addSpeed',skillValue);
            buff.user = user;
            buff.endTime = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(4,3);
            user.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:user,
                    keys:['speed+']
                })
            }
        }
        return true;
    }
}