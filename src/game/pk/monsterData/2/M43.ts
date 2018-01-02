class M43 extends MBase {
    constructor() {
        super();
    }

    private mvID = 103;
    public preload(){
        //MonsterVO.getObject(1).preLoad();
        AniManager.getInstance().preLoadMV(this.mvID)
    }


    //技能动画
    public skillMV(user,target,actionTime,endTime){
        PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    }

    public skill(user:PKMonsterData,target:PKMonsterData){
        var buff = new PKBuffData()
        buff.user = user;
        buff.addState(PKConfig.STATE_MOMIAN);
        buff.endTime = PKData.getInstance().actionTime + 1000*user.getSkillValue(2);
        target.addBuff(buff)
    }

    //
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getVO().getAtkDis() + 100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.isInState(PKConfig.STATE_MOMIAN))
                continue;

            var des = Math.abs(user.x - target.x);
            if(des<=atkrage)
            {
                return [target]
            }
        }
        return [];
    }

}