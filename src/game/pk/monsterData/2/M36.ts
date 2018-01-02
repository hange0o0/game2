class M36 extends MBase {
    constructor() {
        super();
    }

    private mvID = 103;
    public preload(){
        //MonsterVO.getObject(1).preLoad();
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    public onDie(user:PKMonsterData){
        if(user.dieTime)
            return;
        var PD = PKData.getInstance();
        PKMonsterAction.getInstance().addAtkList({   //到actionTime后根据条件产生攻击事件
            type:'skill_before',
            model:this,
            user:user,
            target:user,
            stopTestDie:true,
            actionTime:PD.actionTime,
            endTime:PD.actionTime + 1000*user.getSkillValue(1)
        })
    }

    ////技能动画
    //public skillMV(user,target,actionTime,endTime){
    //    PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    //}


    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 36;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var mData = {
            force:owner.force,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            lastSkill:Number.MAX_VALUE,
            dieTime:PD.actionTime + 1000*user.getSkillValue(2),  //存活时间
            actionTime:PD.actionTime
        }

        var monster = PD.addMonster(mData);
        PKVideoCon.getInstance().playAniOn(monster.id,this.mvID)
    }


}