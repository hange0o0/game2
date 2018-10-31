class M112 extends MBase{
    constructor() {
        super();
    }
    public mvID1 = 200;

    public initMonster(user:PKMonsterData){
        user.atkX = 100
        //user.atkY = 65
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
        if(user.level >= 3 && PD.random()*100 < user.getVO().getHeroSkillValue(3,1))
        {
            var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            var list = [];
            for(var i=0;i<arr.length;i++)
            {
                var targetX = arr[i];
                if(!targetX.beSkillAble())
                    continue;
                if(targetX.haveBuff(112))
                    continue;
                list.push(targetX)
            }
            if(list.length)
            {
                this.addEffect(user,PKData.getInstance().randomOne(list));
            }
        }


        return true;
    }

    public addEffect(user,target){
        if(target.beSkillAble() && !target.haveBuff(112))
        {
            var cd = PKData.getInstance().actionTime + 1000*user.getVO().getHeroSkillValue(1,2);
            var buff = new PKBuffData()
            buff.value = user.level;
            buff.isDebuff = true;
            buff.id = 112;
            buff.user = user;
            buff.endTime = cd;

            var keys = ['hp-']
            buff.addValue('hpChange',-user.getVO().getHeroSkillValue(1,1,user));
            target.addBuff(buff)

            if(user.level>=2)
            {
                buff.tempValue[112] = user.getVO().getHeroSkillValue(2,1) /100;
                buff.endFun = function(buff){
                    buff.owner.addHp(-Math.floor(buff.tempValue[112]*buff.owner.maxHp))
                }
            }

            if(user.level>=4)
            {
                buff.addState(PKConfig.STATE_DIE);
                buff.tempValue['112_4'] = user.getVO().getHeroSkillValue(4,1,user);
            }

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

    public onBuff(buff:PKBuffData){
        var user:PKMonsterData = buff.user
        if(!user.die && buff.tempValue['112_4'])
        {
            user.atk += buff.tempValue['112_4'];
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:user,
                keys:['atk+'],
            })
        }
    }



    public onDie(user:PKMonsterData){
        if(!this.isHeroSkillCDOK(user,5))
            return;
        var PD = PKData.getInstance();
        var mid = 111;
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
}