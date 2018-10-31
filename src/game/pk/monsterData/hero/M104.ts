class M104 extends MBase{
    constructor() {
        super();
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var value = user.getVO().getHeroSkillValue(1,1)/100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(!target.getVO().isNearAtk())
                continue;
            var buff = new PKBuffData()
            buff.value = value;
            buff.id = 104;
            buff.user = user;

            buff.addValue('atk',Math.floor(target.baseAtk*value));
            target.addBuff(buff)
            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:['atk+']
                })
            }

        }

        var listener = new M104StateListener();
        listener.owner = user;
        user.getOwner().teamData.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            target.cleanBuff(0,user);
        }
        user.getOwner().teamData.removeStateListerByOwner(user)
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target)
        if(b)
        {
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            if(user.level >= 2)
            {
                var pushBack = user.level >= 3 && PKData.getInstance().random()*100 < user.getVO().getHeroSkillValue(3,1);
                var backDis = user.getVO().getHeroSkillValue(3,2)
                var atkRage = user.getVO().getHeroSkillValue(2,1);
                var mArr = [];
                for(var i=0;i<arr.length;i++) {
                    var newTarget = arr[i];
                    var tDes = Math.abs(target.x - newTarget.x);
                    if (tDes > atkRage + newTarget.getVO().width / 2)
                        continue;
                    mArr.push(newTarget)
                }
                if(user.level >= 3)
                    var addAtk = mArr.length*user.getVO().getHeroSkillValue(4,1,user)
                else
                    addAtk = 0;

                for(var i=0;i<mArr.length;i++) {
                    var newTarget = arr[i];
                    if (!newTarget.canBeAtk(user))
                        continue;
                    var hp = this.getAtkHp(user,newTarget) + addAtk;
                    newTarget.beAtkAction({hp:hp,atker:user})
                    user.atkAction({hp:hp})

                    if(pushBack)
                    {
                        var addX =  user.x<newTarget.x? backDis:-backDis;
                        newTarget.x += addX;
                        console.log(addX) ;
                    }

                    //if (user.level >= 4) {
                    //    var buff = new PKBuffData()
                    //    buff.value = user.level;
                    //    buff.isDebuff = true;
                    //    buff.id = 103 + '_4';
                    //    buff.user = user;
                    //    buff.endTime = PKData.getInstance().actionTime + 1000 * user.getVO().getHeroSkillValue(4, 1);
                    //    buff.addState(PKConfig.STATE_YUN);
                    //    newTarget.addBuff(buff)
                    //}
                }
            }

        }
        return b;
    }


    public mvID1 = 119;
    public onDie(user:PKMonsterData){
        if(!this.isHeroSkillCDOK(user,5))
            return;
        if(user.reborning)
            return;
        user.reborning = true;
        var PD = PKData.getInstance();
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill_before',
            model:this,
            user:user,
            target:user,
            stopTestDie:true,
            actionTime:PD.actionTime,
            endTime:PD.actionTime + 1000*user.getVO().getHeroSkillValue(5,1)
        })
    }

    protected sendSkillAction(user,target,actionTime,endTime){
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill',
            user:user,
            target:target,
            stopTestDie:true,
            actionTime:actionTime,
            endTime:endTime
        })
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 104;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            y:user.y,
            lastSkill:Number.MAX_VALUE,
            actionTime:PD.actionTime
        }

        var monster = PD.addMonster(mData);
        this.setHeroSkillUse(monster,5)

        var mc = AtkMVCtrl.getInstance().playAniOn(monster.id,this.mvID1)
        if(mc)
        {
            mc.y -= 30
        }
    }
}

class M104StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(!target.getVO().isNearAtk())
            return;
        var mvo = <MonsterVO>this.owner.getVO();
        var value = mvo.getHeroSkillValue(1,1)/100;


        var buff = new PKBuffData()
        buff.value = mvo.level;
        buff.id = 104;
        buff.user = mvo;

        buff.addValue('atk',Math.floor(target.baseAtk*value));
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:['atk+'],
            })
        }
    }
}