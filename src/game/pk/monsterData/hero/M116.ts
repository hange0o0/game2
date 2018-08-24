class M116 extends MBase{
    constructor() {
        super();
    }

    public onCreate(user:PKMonsterData){
        var listener = new M116StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        user.getOwner().teamData.removeStateListerByOwner(user)
    }

    private getHealTarget(user,atkrage){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var selectTarget
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.hp >= target.maxHp)
                continue;

            var des = Math.abs(user.x - target.x);
            if(des<=atkrage)
            {
                target.temp = target.getHpRate();
                if(!selectTarget || selectTarget.temp > target.temp)
                    selectTarget = target
            }
        }
        return selectTarget;
    }

    public skill(user:PKMonsterData,target:PKMonsterData){
        switch(user.useingHeroSkill)
        {
            case 2:
                var buff = new PKBuffData()
                var skillValue =  user.getVO().getHeroSkillValue(2,2,user)
                buff.id = 116;
                buff.value = skillValue;
                buff.user = user;
                buff.addValue('hpChange',skillValue);
                buff.endTime = PKData.getInstance().actionTime + 1000* user.getVO().getHeroSkillValue(2,3);
                target.addBuff(buff)

                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['hp+']
                })
                this.testAddAtk(user,target)
                break
            case 3:
                target.addHp(user.getVO().getHeroSkillValue(3,1,user))
                this.testAddAtk(user,target)
                break;
            case 4:
                target.addHp(user.getVO().getHeroSkillValue(4,2,user))
                this.testAddAtk(user,target)
                break;
        }
    }

    private testAddAtk(user:PKMonsterData,target:PKMonsterData){
        if(user.level >= 5)
            target.atk += user.getVO().getHeroSkillValue(5,1,user);
    }

    //治疗1个单位
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        if(user.level >= 2 && this.isHeroSkillCDOK(user,2))
        {
            user.callHeroSkill = 2;
            var healTarget = this.getHealTarget(user,user.getVO().getHeroSkillValue(2,1))
            if(healTarget)
                return [healTarget];
        }
        if(user.level >= 3 && this.isHeroSkillCDOK(user,3))
        {
            user.callHeroSkill = 3;
            return PD.getMonsterByTeam(user.getOwner().teamData);
        }
        if(user.level >= 4 && this.isHeroSkillCDOK(user,4))
        {
            user.callHeroSkill = 4;
            var healTarget = this.getHealTarget(user,user.getVO().getHeroSkillValue(4,1))
            if(healTarget)
                return [healTarget];
        }
        return [];
    }
}

class M116StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){

        if(PKData.getInstance().actionTime - this.actionTime < 1000)
            return;
        this.actionTime = PKData.getInstance().actionTime;

        var user:PKMonsterData = <PKMonsterData>this.owner;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var list = [];

        var mvo = <MonsterVO>this.owner.getVO();
        var value = mvo.getHeroSkillValue(1,1,user);
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            targetEnemy.addHp(value)
        }
        return list;
    }
}