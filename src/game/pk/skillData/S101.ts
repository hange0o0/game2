class S101 extends SBase{
    constructor() {
        super();
    }

    public mvID = 123;

    //预加载
    public preload() {
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    //取技能目标
    public getSkillTarget(user:PKPosCardData){
        var PD = PKData.getInstance();
        return PD.getMonsterByTeam(user.getOwner().teamData);
    }

    //技能动画
    public skillMV(target:PKMonsterData){
        PKVideoCon.getInstance().playAniIn(target.id,this.mvID)
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData,target:PKMonsterData){
        var addValue = Math.floor(target.baseAtk * user.getSkillValue()/100);
        target.atk += addValue;
        target.addBuff({
            atk:addValue,
            endTime:PKData.getInstance().actionTime + 5*1000
        })
    }
}