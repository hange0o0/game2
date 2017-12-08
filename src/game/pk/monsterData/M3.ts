class M3 extends MBase{
    constructor() {
        super();
    }

    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        super.atkAction(user,target,actionTime);
        var endTime = actionTime + this.getAtkArriveCD(user,target)+50;
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }

    //private mvID = 29;
    //
    //public preload(){
    //    var AM = AniManager.getInstance();
    //    AM.preLoadMV(this.mvID)
    //}
    //
    //public atkMV(user,target,actionTime,endTime){
    //    PKVideoCon.getInstance().playAniBetween(user.id,target.id,this.mvID)
    //}
}