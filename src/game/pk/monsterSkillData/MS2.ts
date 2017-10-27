class MS2 extends MSBase{
    constructor() {
        super();
    }

    //攻击前处理（生成PK事件）
    public atkBefore(user:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime + 200;
        this.sendAtkBefore(user,target,actionTime,endTime)
    }

    //攻击发出处理
    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime + Math.abs(user.x - target.x) + 200
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }

    public atkMV(item:PKMonsterItem,videoData){
        var con = item.parent;
        var target = PKVideoCon.getInstance().getItemByID(videoData.target.id);
        var mc = PKBulletManager.getInstance().createArrow(item,target,videoData.actionTime,videoData.endTime)
        con.addChildAt(mc,con.getChildIndex(item) + 1);
    }
}