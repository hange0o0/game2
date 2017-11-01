class MS4 extends MSBase{
    constructor() {
        super();
    }
    private mvID = 103;
    public preload(){
        MonsterVO.getObject(1).preLoad();
        var AM = AniManager.getInstance();
        AM.preLoadMV(AM.getMVKey(this.mvID))
    }

    //攻击前处理（endTime生成PK事件）
    public atkBefore(user:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime + 300;
        this.sendAtkBefore(user,target,actionTime,endTime)
    }

    //攻击发出处理
    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime + Math.abs(user.x - target.x) + 200
        this.sendAtkAction(user,target,actionTime,endTime) //攻击起作用
    }

    public atkMV(item:PKMonsterItem,videoData){
        PKVideoCon.getInstance().playAniOn(videoData.target.id,this.mvID)
        //var con = item.parent;
        //var target = PKVideoCon.getInstance().getItemByID(videoData.target.id);
        //var mc = PKBulletManager.getInstance().createBulletAni(item,target,videoData.actionTime,videoData.endTime,this.mvID)
        //con.addChildAt(mc,con.getChildIndex(item) + 1);
    }

    public getSkillTarget(user:PKMonsterData){
        return [1];
    }

    //攻击前处理（生成PK事件）
    public skillBefore(user:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime + 300;
        this.sendSkillBefore(user,target,actionTime,endTime)
    }

    //攻击发出处理
    public skillAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        var target = user.target;
        var endTime = actionTime;
        this.sendSkillAction(user,target,actionTime,endTime) //攻击起作用
    }

    public skill(user:PKMonsterData,targets){
        var PD = PKData.getInstance();
        var mid = 1;
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var base = owner.base[1];
        var mData = {
            hp:base.hp,
            atk:base.atk,
            speed:base.speed,
            mid:mid,
            owner:user.owner,
            atkRota:atkRota,
            x:user.x,
            actionTime:PD.actionTime,
            dieTime:PD.actionTime + 20*1000,  //存活时间
        }
        PD.addMonster(mData);

    }
}