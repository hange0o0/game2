class S101 extends SBase{
    constructor() {
        super();
    }

    public mvID = 123;

    public getSkillTarget(user:PKPosCardData){
        return [null];
    }

    public onSkill(user:PKPosCardData,target:PKMonsterData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        for(var i=0;i<arr.length;i++)
        {
            var targetEnemy = arr[i];
            if(!targetEnemy.beSkillAble())
                continue;
            targetEnemy.addHp(-user.getSkillValue(1,true))
        }
        //var listener = new S101StateListener();
        //listener.owner = user;
        //listener.endTime = listener.actionTime + user.getSkillValue(2)
        //user.getOwner().teamData.addStateLister(listener)
    }

    ////预加载
    //public preload() {
    //    AniManager.getInstance().preLoadMV(this.mvID)
    //}

    ////取技能目标
    //public getSkillTarget(user:PKPosCardData){
    //    var PD = PKData.getInstance();
    //    return PD.getMonsterByTeam(user.getOwner().teamData);
    //}
    //
    ////技能动画
    //public skillMV(target:PKMonsterData){
    //    PKVideoCon.getInstance().playAniIn(target.id,this.mvID)
    //}
    //
    ////生效时的逻辑
    //public onSkill(user:PKPosCardData,target:PKMonsterData){
    //    var skillValue = user.getSkillValue(1);
    //    var addValue = Math.floor(target.baseAtk * skillValue/100);
    //    //target.atk += addValue;
    //    var buff = new PKBuffData()
    //    buff.user = user;
    //    buff.id = 101,
    //    buff.value = skillValue,
    //    buff.endTime = PKData.getInstance().actionTime + 5*1000,
    //    buff.addValue('atk',addValue)
    //    target.addBuff(buff)
    //}
}
//
//class S101StateListener extends PKStateListener {
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
//        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
//        for(var i=0;i<arr.length;i++)
//        {
//            var targetEnemy = arr[i];
//            if(!targetEnemy.beSkillAble())
//                continue;
//            targetEnemy.addHp(-user.getSkillValue(1))
//        }
//    }
//}