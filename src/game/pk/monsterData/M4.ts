class M4 extends MBase{
    constructor() {
        super();
    }
    //private mvID = 103;
    //public preload(){
    //    MonsterVO.getObject(1).preLoad();
    //    AniManager.getInstance().preLoadMV(this.mvID)
    //}
    //
    ////伤害飞行时间
    //protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
    //    return Math.abs(user.x - target.x) + 200;
    //}
    //
    //public atkMV(user,target,actionTime,endTime){
    //    PKVideoCon.getInstance().playAniOn(target.id,this.mvID)
    //    //var con = item.parent;
    //    //var target = PKVideoCon.getInstance().getItemByID(videoData.target.id);
    //    //var mc = PKBulletManager.getInstance().createBulletAni(item,target,videoData.actionTime,videoData.endTime,this.mvID)
    //    //con.addChildAt(mc,con.getChildIndex(item) + 1);
    //}
    //
    //
    //
    //
    //
    //public getSkillTarget(user:PKMonsterData){
    //    return [null];
    //}
    //
    //public skill(user:PKMonsterData,targets){
    //    var PD = PKData.getInstance();
    //    var mid = 1;
    //    var owner = PD.getPlayer(user.owner);
    //    var atkRota = owner.teamData.atkRota;
    //    var mData = {
    //        force:owner.force,
    //        mid:mid,
    //        owner:user.owner,
    //        atkRota:atkRota,
    //        x:user.x,
    //        actionTime:PD.actionTime,
    //        lastSkill:Number.MAX_VALUE,
    //        dieTime:PD.actionTime + 20*1000,  //存活时间
    //    }
    //    PD.addMonster(mData);
    //}
}