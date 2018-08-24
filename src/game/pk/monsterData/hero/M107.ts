class M107 extends MBase{
    constructor() {
        super();
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        this.addBuff(user,target);

        return true;
    }

    private addBuff(user,target){
        if(!target.haveBuff(107) && !target.isInState(PKConfig.STATE_MOMIAN))
        {
            var buff = new PKBuffData()
            buff.value = user.level;
            buff.isDebuff = true;
            buff.id = 107;
            buff.user = user;
            buff.addState(PKConfig.STATE_DIE);
            buff.addState(PKConfig.STATE_ILL);
            if(user.level >= 2)
            {
                buff.addValue('addSpeed',-user.getVO().getHeroSkillValue(2,1,user));
            }
            target.addBuff(buff)
        }
    }

    public onBuff(buff:PKBuffData){
        var PD = PKData.getInstance();
        var user:PKMonsterData = buff.user
        var target:PKMonsterData = buff.owner

        if(buff.id == 107)
        {
            if(!target.getVO().isHero())
            {
                var num = user.level >= 5?user.getVO().getHeroSkillValue(5,1):1;
                for(var i=0;i<num;i++)
                {
                    var mid = target.mid;
                    var owner = PD.getPlayer(user.owner);
                    var atkRota = owner.teamData.atkRota;
                    var mData = {
                        force:owner.force,
                        mid:mid,
                        owner:user.owner,
                        atkRota:atkRota,
                        x:target.x,
                        y:-30 + Math.random()*60,
                        dieTime:PD.actionTime + user.getVO().getHeroSkillValue(1,1)*1000,
                        lastSkill:Number.MAX_VALUE,
                        actionTime:PD.actionTime
                    }
                    var monsterVO = PD.addMonster(mData);
                    var buff = new PKBuffData()
                    buff.value = user.level;
                    buff.id = '107_2';
                    buff.user = user;
                    buff.state['stopDieIcon'] = true
                    buff.addState(PKConfig.STATE_DIE);
                    buff.addState(PKConfig.STATE_NOBEATK);
                    buff.addState(PKConfig.STATE_MOMIAN);
                    buff.addState(PKConfig.STATE_SOUL);
                    monsterVO.addBuff(buff)
                }
            }

            if(user.level >= 3)
            {
                var arr = PD.getMonsterByTeam(target.getOwner().teamData);
                var atkrage = user.getVO().getHeroSkillValue(3,1);
                for(var i=0;i<arr.length;i++)
                {
                    var targetX = arr[i];
                    if(target == targetX)
                        continue;
                    var des = Math.abs(target.x - targetX.x);
                    if(des<=atkrage)
                    {
                        this.addBuff(user,targetX);
                    }
                }
            }
        }
        else if(buff.id == '107_2')
        {
            user.addHp(target.atkHurtCount)
        }
    }
}