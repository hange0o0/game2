class M47 extends MBase {
    constructor() {
        super();
    }

    private mvID = 103;
    public preload(){
        //MonsterVO.getObject(1).preLoad();
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    public atkMV(user,target,actionTime,endTime){
        var mc = PKVideoCon.getInstance().dropOn(target.id,Config.localResRoot + 'monster/enemy47_attack.png')
        mc.anchorOffsetX = 52
        mc.anchorOffsetY = 110
    }


    //技能动画
    public skillMV(user,target,actionTime,endTime){
        PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    }

    public skill(user:PKMonsterData,target:PKMonsterData){
        var skillValue = user.getSkillValue(1);
        target.manaHp += skillValue
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            key:1,
            stateType:1
        })
    }

    //
    public getSkillTarget(user:PKMonsterData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var atkrage = user.getVO().getAtkDis() + 100;
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(target.haveBuff(46))
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