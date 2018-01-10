class M48 extends MBase {
    constructor() {
        super();
    }

    private mvID = 200;
    public preload(){
        //MonsterVO.getObject(1).preLoad();
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    public initMonster(user:PKMonsterData){
        user.atkX = 40
        //user.atkY = 65
    }

    //public preload(){
    //    RES.getResByUrl(Config.localResRoot + 'monster/enemy48_attack.png',function(){},this)
    //}

    //伤害飞行时间
    protected getAtkArriveCD(user:PKMonsterData,target:PKMonsterData){
        return 100//Math.abs(user.x - target.x) + 100;
    }

    public atkMV(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc = PKVideoCon.getInstance().playAniOn(user.id,200)
        if(mc)
        {
            mc.scaleY = 1;
            if(userItem.x > targetItem.x)
            {
                mc.scaleX = -1
                mc.x -= 30
            }
            else
            {
                mc.scaleX = 1
                mc.x += 30
            }
            mc.y -= 70
        }
        //var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        //var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        //var mc:BulletAniMC2 = <BulletAniMC2>(PKBulletManager.getInstance().createBulletAni2(userItem,targetItem,actionTime,endTime))
        //mc.mc.anchorOffsetX = 600/4/2-20
        //mc.mc.anchorOffsetY = 85/2
        //if(userItem.x > targetItem.x)
        //    mc.mc.scaleX = 1
        //else
        //    mc.mc.scaleX = -1
        //mc.mc.load(48,0,600,85)
        //mc.mc.play()
    }

    public atk(user:PKMonsterData,target:PKMonsterData){
        var b = super.atk(user,target);
        if(!b)
            return false;
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData.enemy);
        var atkRage = user.getSkillValue(1);
        var hurt = user.getSkillValue(2,true);
        for(var i=0;i<arr.length;i++)
        {
            var newTarget = arr[i];
            if(newTarget == target)
                continue;

            if(!newTarget.canBeAtk(user))
                continue;
            var tDes = Math.abs(target.x - newTarget.x);
            if(tDes > atkRage + newTarget.getVO().width/2)
                continue;

            newTarget.beAtkAction({hp:hurt})
        }
        return true;
    }
}