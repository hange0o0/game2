class S103 extends SBase{
    constructor() {
        super();
    }

    public mvID = 103;

    //预加载
    public preload() {
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    //取技能目标
    public getSkillTarget(user:PKPosCardData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        if(arr.length > 2)
        {
            return [PD.randomOne(arr,true),PD.randomOne(arr,true)]
        }
        return arr;
    }

    //能否生效
    public useAble(user:PKPosCardData){
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        return arr.length >= 3;
    }

    //技能动画
    public skillMV(target:PKMonsterData){
        PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData,target:PKMonsterData){
        target.beAtkAction({hp:user.getSkillValue()})
    }
}