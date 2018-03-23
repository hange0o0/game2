class S210 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 128;
    public mvID2 = 30;


    public onSkill(user:PKPosCardData) {
        var num = user.getSkillValue(1);
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        if(arr.length > num)
        {
            PD.upsetArr(arr)
            arr.length = num;
        }
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            target.skillTemp[210] = 1;
            target.skillTemp['210V'] = user.getSkillValue(2)/100;
        }
        return arr;
    }

    public onIll(buff:PKBuffData){
        var PD = PKData.getInstance();
        var target:PKMonsterData = buff.user;
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'delay_run',
            fun:()=>{
                this.delayFun(target)
            },
            stopTestDie:true,
            actionTime:PD.actionTime,
            endTime:PD.actionTime + 1000
        })
    }

    public delayFun(target?:PKMonsterData){
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
            hpRate:target.skillTemp['210V'],
            actionTime:PD.actionTime
        }

        var monster = PD.addMonster(mData);
        monster.skillTemp[210] = 2;

        AtkMVCtrl.getInstance().playAniOn(monster.id,this.mvID1)
    }
}