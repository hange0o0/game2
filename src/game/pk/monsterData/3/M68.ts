class M68 extends MBase {
    constructor() {
        super();
    }

    public preload(){
        RES.getResByUrl(Config.localResRoot + 'monster/enemy68_attack.png',function(){},this)
    }

    public atkMV(user,target,actionTime,endTime){
        var AM = AniManager.getInstance();
        var mc = AM.getImg(Config.localResRoot + 'monster/enemy68_attack.png');
        mc.anchorOffsetX = 65/2
        mc.anchorOffsetY = 60/2
        var tw = egret.Tween.get(mc);
        tw.to({rotation:720},200).set({rotation:0}).to({rotation:720,scaleX:0.1,scaleY:0.1},100).call(()=>{
            AM.removeImg(mc);
        })
        var atker = PKVideoCon.getInstance().getItemByID(user.id)
        mc.x = atker.x + user.atkRota * 20
        mc.y = atker.y - 40
        atker.parent.addChildAt(mc,atker.parent.getChildIndex(atker) + 1);
        //PKVideoCon.getInstance().addMCOn(user.id,mc)
    }

    //取攻击力
    protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
        var atk = super.getAtkerAtk(user,target)
        if(!target.skillTemp[66])
            target.skillTemp[66] = {}
        if(!target.skillTemp[66][user.id])
            target.skillTemp[66][user.id] = 1
        atk = atk * (target.skillTemp[66][user.id])
        return atk;
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(b)
            target.skillTemp[66][user.id] = target.skillTemp[66][user.id] * user.getSkillValue(1)
        return b;
    }
}