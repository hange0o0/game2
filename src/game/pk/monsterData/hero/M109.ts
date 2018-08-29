class M109 extends MBase{
    constructor() {
        super();
    }

    public initMonster(user:PKMonsterData){
        if(user.level >= 3)
        {
            user.doubleRate = user.getVO().getHeroSkillValue(3,1)/100;
            user.doubleValue = user.getVO().getHeroSkillValue(3,2)/100;
        }
    }

    public onCreate(user:PKMonsterData){
        var listener = new S109StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        teamData.addStateLister(listener);
    }



    public getSkillTarget(user:PKMonsterData){
        if(user.level >= 4 && user.getHpRate()*100 <= user.getVO().getHeroSkillValue(4,1) && this.isHeroSkillCDOK(user,4))
        {
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData);
            var atkrage = user.getVO().getHeroSkillValue(4,2);
            var selectTarget
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                if(target.getVO().isHero())
                    continue;
                var des = Math.abs(user.x - target.x);
                if(des<=atkrage)
                {
                    target.temp = des;
                    if(!selectTarget || selectTarget.temp > target.temp)
                        selectTarget = target
                }
            }
            if(selectTarget)
            {
                user.callHeroSkill = 4;
                return [selectTarget]
            }
            return [];
        }
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 4)
        {
            user.addHp(target.hp);
            target.setDie();
            if(!user.skillTemp[109])
                user.skillTemp[109] = [];
            user.skillTemp[109].push(target.mid)
        }
    }

    public onDie(user:PKMonsterData){
        if(!user.skillTemp[109])
            return;
        var PD = PKData.getInstance();
        var arr = user.skillTemp[109];
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        //var cd = PD.actionTime + user.getVO().getHeroSkillValue(5,1)*1000;
        for(var i=0;i<arr.length;i++)
        {
            var mid = arr[i];
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:user.x,
                y:-30 + Math.random()*60,
                //dieTime:cd,
                actionTime:PD.actionTime
            }
            PD.addMonster(mData);
        }
    }
}

class S109StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_DIE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var user:PKMonsterData = <PKMonsterData>this.owner
        if(user.die)
            return;
        var keys = ['atk+']
        user.atk += Math.ceil(user.getVO().getHeroSkillValue(1,1)/100*user.baseAtk)
        if(user.level>=2)
        {
            user.addSpeed += user.getVO().getHeroSkillValue(2,1);
            keys.push('speed+')
        }

        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            keys:keys
        })
    }


}