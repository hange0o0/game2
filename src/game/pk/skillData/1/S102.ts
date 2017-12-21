class S102 extends SBase{
    constructor() {
        super();
    }

    public mvID = 123;


    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            targetEnemy.addHp(user.getSkillValue(1,true))
        }
        return arr;
    }

    ////预加载
    //public preload() {
    //    AniManager.getInstance().preLoadMV(this.mvID)
    //}

    ////技能动画
    //public skillMV(target:PKMonsterData){
    //    PKVideoCon.getInstance().playAniIn(target.id,this.mvID)
    //}
    //
    ////生效时的逻辑
    //public onSkill(user:PKPosCardData,target:PKMonsterData){
    //    var addValue = Math.floor(target.baseAtk * user.getSkillValue(1)/100);
    //    target.atk += addValue;
    //    //target.addBuff({
    //    //    atk:addValue,
    //    //    endTime:PKData.getInstance().actionTime + 5*1000
    //    //})
    //}
}

//class S102StateListener extends PKStateListener {
//    public type = PKConfig.LISTENER_TIMER
//    public actionTime
//    constructor() {
//        super();
//        //this.actionTime = PKData.getInstance().actionTime;
//    }
//
//    // 起作用时会调用的方法
//    public actionFun(target?:PKMonsterData){
//        if(PKData.getInstance().actionTime - this.actionTime < 1000)
//            return;
//
//        this.actionTime = PKData.getInstance().actionTime;
//        var user:PKPosCardData = <PKPosCardData>this.owner;
//        var PD = PKData.getInstance();
//        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
//        for(var i=0;i<arr.length;i++)
//        {
//            var targetEnemy = arr[i];
//            targetEnemy.addHp(user.getSkillValue(1))
//        }
//    }
//}