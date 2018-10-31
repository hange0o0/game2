class M111 extends MBase{
    constructor() {
        super();
    }

    public mvID1 = 201;

    public initMonster(user:PKMonsterData){
        user.atkX = 100
        //user.atkY = 65
    }

    public beAtkAction(user,data){
        //{hp:hp,atker:user}
        if(data.atker)
        {
            if(user.level >= 3)
            {
                user.addHp(user.getVO().getHeroSkillValue(3,1,user))
            }
            if(user.level >= 4 && user.def < user.getVO().getHeroSkillValue(4,2))
            {
                user.def++;
            }
        }
    }
    public onDie(user:PKMonsterData){
        if(!this.isHeroSkillCDOK(user,5))
            return;
        var PD = PKData.getInstance();
        var mid = 112;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            level:user.level,
            x:user.x,
            y:user.y,
            actionTime:PD.actionTime
        }
        var monsterVO = PD.addMonster(mData);
        this.setHeroSkillUse(monsterVO,5,Number.MAX_VALUE)
    }


    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 100//Math.abs(user.x - target.x) + 100;
    }



    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        this.addEffect(user,target);

        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkRage =  user.getVO().getHeroSkillValue(1,1);
        var hurt =  user.getVO().getHeroSkillValue(1,2,user);
        for(var i=0;i<arr.length;i++)
        {
            var newTarget = arr[i];
            if(newTarget == target)
                continue;

            if(!newTarget.canBeAtk(user))
                continue;
            var tDes = Math.abs(target.x - newTarget.x);
            if(tDes > atkRage + newTarget.getVO().width/2)
                continue;

            newTarget.beAtkAction({hp:hurt})
            user.addAtkHurt(hurt)


            this.addEffect(user,newTarget);

        }
        return true;
    }

    public addEffect(user,target){
        if(user.level >= 2 && target.beSkillAble())
        {
            var cd = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(2,2);
            var buff = new PKBuffData()
            buff.value = user.level;
            buff.isDebuff = true;
            buff.id = 111;
            buff.user = user;
            buff.endTime = cd;

            var keys = ['speed-']
            buff.addValue('addSpeed',-user.getVO().getHeroSkillValue(2,1));
            target.addBuff(buff)


            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:keys,
                })
            }
        }
    }


}