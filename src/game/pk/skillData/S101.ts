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
        PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData,target:PKMonsterData){
        target.atk +=  Math.floor(target.baseAtk * user.getSkillValue()/100);
    }
}