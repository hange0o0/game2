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
        var list = []
        for(var i=0;i<arr.length;i++)
        {
            var target = arr[i];
            if(!target.beSkillAble())
                continue;
            list.push(target)

        }
        var num = user.getSkillValue(2);
        if(list.length > num)
        {
            ArrayUtil.sortByField(list,['hp'],[1])
            list.length = num;
        }
        return list;
    }
    //
    ////能否生效
    //public useAble(user:PKPosCardData){
    //    var PD = PKData.getInstance();
    //    var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
    //    return arr.length >= 3;
    //}
    //
    //技能动画
    public skillMV(target:PKMonsterData){
        PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    }
    //
    //生效时的逻辑
    public onSkill(user:PKPosCardData,target:PKMonsterData){
        target.addHp(-user.getSkillValue(1,true))
    }
}