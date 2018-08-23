class M102 extends MBase{
    constructor() {
        super();
    }

    //伤害飞行时间
    protected getSkillArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }

    public getSkillTarget(user:PKMonsterData){
        if(user.level >= 1 && this.isHeroSkillCDOK(user,1))
        {
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            var atkrage = user.getVO().getHeroSkillValue(1,1);
            var list = [];
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                if(!target.canBeAtk(user))
                    continue;
                var des = Math.abs(user.x - target.x);
                if(des<=atkrage)
                {
                    list.push(target)
                }
            }
            user.callHeroSkill = 1;
            return list;
        }
        return [];
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 1)
        {
            var hp = user.getVO().getHeroSkillValue(1,2,user)
            target.beAtkAction({hp:hp,atker:user})
            user.addAtkHurt(hp)

            if(user.level >= 2)
            {
                var buff = new PKBuffData()
                buff.value = user.level;
                buff.isDebuff = true;
                buff.id = 102;
                buff.user = user;
                buff.endTime = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(2,2);

                buff.addValue('addSpeed',-user.getVO().getHeroSkillValue(2,1));
                if(user.level>=3)
                {
                    buff.addValue('hpChange',-user.getVO().getHeroSkillValue(3,1,user));
                }
                target.addBuff(buff)
                if(buff.ing)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                        user:target,
                        key:'speed',
                        stateType:2
                    })
                }

                if(user.level>=4 && PKData.getInstance().random()*100 < user.getVO().getHeroSkillValue(4,1))
                {
                    var buff = new PKBuffData()
                    buff.value = user.level;
                    buff.isDebuff = true;
                    buff.id = 102+'_4';
                    buff.user = user;
                    buff.endTime = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(4,2);
                    buff.addState(PKConfig.STATE_YUN);
                    target.addBuff(buff)
                }

            }
        }
    }


}