class S209 extends SBase {
    constructor() {
        super();
    }

    public mvID1 = 128;


    public onSkill(user:PKPosCardData) {
        var listener = new S109StateListener()
        var teamData = user.getOwner().teamData;
        listener.owner = user;
        listener.mvID = this.mvID1;
        listener.hpRate = user.getSkillValue(1)/100;
        listener.endTime = PKData.getInstance().actionTime + user.getSkillValue(2) *1000;
        teamData.addStateLister(listener);
        return [];
    }


}


class S109StateListener extends PKStateListener {
    public type = PKConfig.LISTENER_DIE
    public hpRate
    public actionTime
    constructor() {
        super();
        this.actionTime = PKData.getInstance().actionTime;
    }

    // 起作用时会调用的方法
    public actionFun(target?:PKMonsterData){
        if(target.skillTemp[209])
            return;
        var PD = PKData.getInstance();
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
        if(PD.actionTime > this.endTime)
            return;
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
            hpRate:this.hpRate,
            actionTime:PD.actionTime
        }

        var monster = PD.addMonster(mData);
        monster.skillTemp[209] = true;

        AtkMVCtrl.getInstance().playAniOn(monster.id,this.mvID)
    }

}