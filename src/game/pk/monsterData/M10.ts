class M10 extends MBase {
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
        target.addHp(user.getSkillValue(1,true))
    }

    //治疗1个单位
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getVO().atkrage + 100;
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
        if(selectTarget)
        {
           return [selectTarget]
        }
        return [];
    }
}