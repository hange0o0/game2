class M101 extends MBase{
    constructor() {
        super();
    }
    public mvID1 = 119;

    public initMonster(user:PKMonsterData){
        if(user.level >= 4)
        {
           this.setHeroSkillUse(user,4)
        }
    }

    public onCreate(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var value1 = user.getVO().getHeroSkillValue(1,1);
        var value2 = user.getVO().getHeroSkillValue(2,1)/100;
        var value3 = user.getVO().getHeroSkillValue(3,1);
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            var buff = new PKBuffData()
            buff.value = user.level;
            buff.isDebuff = true;
            buff.id = 101;
            buff.user = user;

            var keys = ['def-']
            buff.addValue('def',-value1);
            if(user.level>=2)
            {
                buff.addValue('atk',-Math.floor(target.atk*value2));
                keys.push('atk-')
            }
            if(user.level>=3)
            {
                buff.addValue('addSpeed',-value3);
                keys.push('speed-')
            }
            target.addBuff(buff)

            if(buff.ing)
            {
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                    user:target,
                    keys:keys
                })
            }

        }

        var listener = new M101StateListener();
        listener.owner = user;
        user.getOwner().teamData.enemy.addStateLister(listener)
    }

    public onRemove(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        for(var i=0;i<arr.length;i++)
        {
            var target:PKMonsterData = arr[i];
            target.cleanBuff(0,user);
        }
        user.getOwner().teamData.enemy.removeStateListerByOwner(user)
    }

    public getSkillTarget(user:PKMonsterData){
        if(user.level>=5 && this.isHeroSkillCDOK(user,5))
        {
            user.callHeroSkill = 5;
            return [null];
        }
        else if(user.level >= 4 && this.isHeroSkillCDOK(user,4))
        {
            var PD = PKData.getInstance();
            var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
            var atkrage = user.getVO().getHeroSkillValue(4,1);
            var list = [];
            for(var i=0;i<arr.length;i++)
            {
                var target = arr[i];
                if(target.isHero())
                    continue;
                if(!target.beSkillAble())
                    continue;
                if(PKData.getInstance().actionTime - (target.skillTemp['101_4'] || 0) < 1000)
                    continue;
                var des = Math.abs(user.x - target.x);
                if(des<=atkrage)
                {
                    list.push(target)
                }
            }
            if(list.length)
            {
                var target = PKData.getInstance().randomOne(list)
                target.skillTemp['101_4'] = PKData.getInstance().actionTime
                user.callHeroSkill = 4;
                return [target];
            }
            return [];
        }
    }

    public skill(user:PKMonsterData,target){
        if(user.useingHeroSkill == 5)
        {
            var PD = PKData.getInstance();
            var mid = 101;
            var owner = PD.getPlayer(user.owner);
            var atkRota = owner.teamData.atkRota;
            var mData = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                level:user.level,
                x:user.x,
                y:-30 + Math.random()*60,
                actionTime:PD.actionTime
            }
            this.setHeroSkillUse(user,5,Number.MAX_VALUE)
            var monsterVO = PD.addMonster(mData);
            this.setHeroSkillUse(monsterVO,5,Number.MAX_VALUE)
        }
        else if(user.useingHeroSkill == 4)
        {
            target.owner = user.owner
            target.atkRota = user.atkRota;
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_CHANGE_TEAM,
                user:target
            })
        }

        //mData.y = -30 + Math.random()*60;
        //PD.addMonster(mData);
    }
}

class M101StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_CREATE
    constructor() {
        super();
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        var mvo = <MonsterVO>this.owner.getVO();
        var value1 = mvo.getHeroSkillValue(1,1);
        var value2 = mvo.getHeroSkillValue(2,1)/100;
        var value3 = mvo.getHeroSkillValue(3,1);


        var buff = new PKBuffData()
        buff.value = mvo.level;
        buff.isDebuff = true;
        buff.id = 101;
        buff.user = mvo;


        var keys = ['def-']
        buff.addValue('def',-value1);
        if(mvo.level>=2)
        {
            buff.addValue('atk',-Math.floor(target.atk*value2));
            keys.push('atk-')
        }
        if(mvo.level>=3)
        {
            buff.addValue('addSpeed',-value3);
            keys.push('speed-')
        }
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                keys:keys
            })
        }
    }
}




//class M101 extends MBase {
//    constructor() {
//        super();
//    }
//    public mvID1 = 103;
//    //初始化怪物隐藏属性
//    public initMonster(user:PKMonsterData){
//        if(user.level >= 4)
//        {
//            user.manaHp +=  user.getVO().getHeroSkill(4).getSkillValue(1,user);
//            user.hp = user.manaHp;
//        }
//        if(user.level >= 5)
//            user.hpChange +=  user.getVO().getHeroSkill(5).getSkillValue(1,user);
//    }
//
//    public onCreate(user:PKMonsterData){
//        if(user.level >= 3)
//        {
//            var PD = PKData.getInstance();
//            var arr = PD.getMonsterByTeam(user.getOwner().teamData);
//            var value = user.getVO().getHeroSkill(3).getSkillValue(1,user);
//            for(var i=0;i<arr.length;i++)
//            {
//                var target = arr[i];
//                var buff = new PKBuffData()
//                buff.id = 101;
//                buff.user = user;
//                buff.addValue('atk',value);
//                target.addBuff(buff)
//
//                if(buff.ing)
//                {
//                    PKData.getInstance().addVideo({
//                        type:PKConfig.VIDEO_MONSTER_ADD_STATE,
//                        user:target,
//                        key:'atk',
//                        stateType:1
//                    })
//                }
//
//            }
//
//            var listener = new M101StateListener();
//            listener.owner = user;
//            user.getOwner().teamData.addStateLister(listener)
//        }
//    }
//
//    public onRemove(user:PKMonsterData){
//        var PD = PKData.getInstance();
//        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
//        for(var i=0;i<arr.length;i++)
//        {
//            var target:PKMonsterData = arr[i];
//            target.cleanBuff(0,user);
//        }
//        user.getOwner().teamData.removeStateListerByOwner(user)
//    }
//
//    private testTarget(target){
//        if(!target.beSkillAble())
//            return false;
//        return true
//    }
//
//    public getSkillTarget(user:PKMonsterData){
//        //if(user.callHeroSkill)
//        //    return [];
//        var PD = PKData.getInstance();
//        var list
//        if(user.level >= 1 && this.isHeroSkillCDOK(user,1))
//        {
//            user.callHeroSkill = 1;
//            list = PD.getMonsterByTeam(user.getOwner().teamData.enemy,this.testTarget,[user]);
//            if(list.length > 0)
//                return [PKData.getInstance().randomOne(list)];
//        }
//        if(user.level >= 2 && this.isHeroSkillCDOK(user,2))
//        {
//            user.callHeroSkill = 2;
//            if(!list)
//                list = PD.getMonsterByTeam(user.getOwner().teamData.enemy,this.testTarget,[user]);
//            return list;
//        }
//        return [];
//    }
//
//    public skill(user:PKMonsterData,target){
//        //console.log(user.useingHeroSkill)
//        switch(user.useingHeroSkill)
//        {
//            case 1:
//            case 2:
//                //PKData.getInstance().actionRecord.push('skill|' + PKData.getInstance().actionTime+'|' + user.id+'|'+target.id)
//                var hp = user.getVO().getHeroSkill(user.useingHeroSkill).getSkillValue(1,user)
//                target.beAtkAction({hp:hp,atker:user})
//                user.atkAction({hp:hp})
//
//                break;
//        }
//    }
//}
//
//class M101StateListener extends PKStateListener {
//    public type = PKConfig.LISTENER_CREATE
//    constructor() {
//        super();
//    }
//
//    // 起作用时会调用的方法
//    public actionFun(target?:PKMonsterData){
//        var value = (<MonsterVO>this.owner.getVO()).getHeroSkill(3).getSkillValue(1,this.owner);
//        var buff = new PKBuffData()
//        buff.id = 101;
//        buff.user = this.owner;
//        buff.addValue('atk',value);
//        target.addBuff(buff)
//        if(buff.ing)
//        {
//            PKData.getInstance().addVideo({
//                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
//                user:target,
//                key:'atk',
//                stateType:1
//            })
//        }
//    }
//}