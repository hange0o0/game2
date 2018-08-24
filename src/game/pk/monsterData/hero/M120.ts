class M120 extends MBase{
    constructor() {
        super();
    }

    private testTarget1(target:PKMonsterData){
        if(target.getVO().isHero())
            return false;
        return true
    }
    private testTarget4(target:PKMonsterData){
        if(target.skillTemp[120])
            return true;
        return false
    }

    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var list
        if(user.level >= 1 && this.isHeroSkillCDOK(user,1))
        {
            user.callHeroSkill = 1;
            list = PD.getMonsterByTeam(user.getOwner().teamData,this.testTarget1);
            if(list.length > 0)
                return this.resetSkillTarget(user,list)
        }
        if(user.level >= 4 && this.isHeroSkillCDOK(user,4))
        {
            user.callHeroSkill = 4;
            list = PD.getMonsterByTeam(user.getOwner().teamData,this.testTarget4);
            if(list.length > 0)
                return list;
        }
        return [];
    }

    private resetSkillTarget(user,arr){
        var list = [PKData.getInstance().randomOne(arr,true)]
        if(user.level >= 5 && arr.length > 0)
            list.push(PKData.getInstance().randomOne(arr,true))
        return list
    }

    public skill(user:PKMonsterData,target){
        //console.log(user.useingHeroSkill)
        switch(user.useingHeroSkill)
        {
            case 1:
                var PD = PKData.getInstance();
                var mid = 101;
                var owner = PD.getPlayer(user.owner);
                var atkRota = owner.teamData.atkRota;
                var mData = {
                    force:owner.force,
                    mid:mid,
                    owner:user.owner,
                    atkRota:atkRota,
                    x:user.x,
                    y:-30 + Math.random()*60,
                    dieTime:PD.actionTime + user.getVO().getHeroSkillValue(user.useingHeroSkill,2)*1000,
                    actionTime:PD.actionTime
                }
                var monsterData = PD.addMonster(mData);
                var dec = monsterData.maxHp - monsterData.hp
                monsterData.maxHp = user.getVO().getHeroSkillValue(user.useingHeroSkill,1,user);
                monsterData.hp = monsterData.maxHp - dec;
                monsterData.skillTemp[120] = true

                if(user.level >= 2)
                    monsterData.momian = true;
                if(user.level >= 3)
                {
                    var buff = new PKBuffData()
                    buff.id = 120;
                    buff.user = user;
                    buff.addState(PKConfig.STATE_DIE);
                    monsterData.addBuff(buff)
                }

                break;
            case 4:
                var addHp =  user.getVO().getHeroSkillValue(user.useingHeroSkill,1,user);
                target.maxHp += addHp;
                target.addHp(addHp);
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['hp+']
                })
                break;

        }
    }

    public onBuff(buff:PKBuffData){
        var user:PKMonsterData = buff.user
        var target:PKMonsterData = buff.owner
        if(user.die)
            return;
        user.addHp(target.maxHp)
    }
}