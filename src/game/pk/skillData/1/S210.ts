class S210 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 128;
    public mvID2 = 30;


    public onSkill(user:PKPosCardData) {
        var num = user.getSkillValue(1);
        var skillValue = user.getSkillValue(2)/100;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        if(arr.length > num)
        {
            PD.randSort(arr)
            //arr.length = num;
        }
        for(var i=0;i<arr.length && num > 0;i++)
        {
            var target = arr[i];
            if(target.dieTime)
                continue;
            if(target.haveBuff(210))
                continue;

            var buff = new PKBuffData()
            buff.user = user;
            buff.id = 210;
            buff.value = skillValue;
            buff.endTime = Number.MAX_VALUE
            buff.addState(PKConfig.STATE_DIE)
            target.addBuff(buff)
            num--;
        }
        return arr;
    }

    public onBuff(buff:PKBuffData){
        var PD = PKData.getInstance();
        var target:PKMonsterData = buff.owner;
        if(target.reborning)
            return;
        target.reborning = true;
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'delay_run',
            fun:()=>{
                this.delayFun(target,buff)
            },
            stopTestDie:true,
            actionTime:PD.actionTime,
            endTime:PD.actionTime + 1000
        })
    }

    public delayFun(target:PKMonsterData,buff:PKBuffData){
        var PD = PKData.getInstance();
        var mid = target.mid;
        var owner = PD.getPlayer(target.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:target.owner,
            atkRota:atkRota,
            x:target.x,
            y:target.y,
            hpRate:buff.value,
            actionTime:PD.actionTime
        }

        var monster = PD.addMonster(mData);
        AtkMVCtrl.getInstance().playAniOn(monster.id,this.mvID1)
    }
}