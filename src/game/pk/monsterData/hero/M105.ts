class M105 extends MBase{
    constructor() {
        super();
    }
    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var addHp = 0;
        var addAtk = 0;
        var hpRate = user.getVO().getHeroSkillValue(1,1)/100;
        var atkRate = user.getVO().getHeroSkillValue(2,1)/100;
        if(user.level >= 5)
            hpRate = atkRate = user.getVO().getHeroSkillValue(5,1)/100;
        for(var i=0;i<arr.length;i++) {
            var target = arr[i];
            if(target.getVO().isHero())
                continue;

            addHp+= target.hp*hpRate
            if(user.level >= 2)
                addAtk+= target.atk*atkRate
            target.setDie();

            if(user.level >= 3)
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
                buff.id = '105_3';
                buff.user = user;
                buff.state['stopDieIcon'] = true
                buff.addState(PKConfig.STATE_DIE);
                buff.addState(PKConfig.STATE_NOBEATK);
                buff.addState(PKConfig.STATE_MOMIAN);
                buff.addState(PKConfig.STATE_SOUL);
                monsterVO.addBuff(buff)
            }
        }
        user.hp += Math.ceil(addHp);
        user.atk += Math.ceil(addAtk);

        var listener = new M105StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        user.getOwner().teamData.removeStateListerByOwner(user)
    }


}

class M105StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_TIMER
    public actionTime
    //public x
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){

        if(PKData.getInstance().actionTime - this.actionTime < 500)
            return;

        this.actionTime = PKData.getInstance().actionTime;

        var user:PKMonsterData = <PKMonsterData>this.owner;
        var mvo = user.getVO();
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkrage = mvo.getHeroSkillValue(4,1);
        var hurt = Math.ceil(mvo.getHeroSkillValue(4,2,user)/2);
        var list = [];


        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            var des = Math.abs(user.x - targetEnemy.x);
            if(des<=atkrage)
            {
                targetEnemy.addHp(-hurt)
            }
        }
        return list;
    }
}