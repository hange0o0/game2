class M3 extends MBase{
    constructor() {
        super();
    }

    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        super.atkAction(user,target,actionTime);
        var endTime = actionTime + this.getAtkArriveCD(user,target)+50;
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return Math.abs(user.x - target.x) + 200;
    }

    public atkMV(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var item = PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime)
        var mc = item.mc;
        mc.source = Config.localResRoot + 'monster/enemy3_attack.png'
        mc.anchorOffsetX = 55/2
        mc.anchorOffsetY = 30/2
        var tw = egret.Tween.get(mc,{loop:true});
        tw.to({rotation:360},300)
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