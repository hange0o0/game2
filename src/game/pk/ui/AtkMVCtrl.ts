class AtkMVCtrl {
    private static instance:AtkMVCtrl;

    public static getInstance() {
        if (!this.instance) this.instance = new AtkMVCtrl();
        return this.instance;
    }

    public preLoadMV(id){
        AniManager.getInstance().preLoadMV(id)
    }
    public preLoadPNG(url){
        RES.getResByUrl(Config.localResRoot +url,function(){},this)
    }
    public preLoadPNGLocal(url){
        RES.getResAsync(url,function(){},this)
    }
    public playAniOn(id,mvid){
        if(!PKVideoCon.getInstance().stage)
            return;
        return PKVideoCon.getInstance().playAniOn(id,mvid)
    }

    public mAtkMV(mid,user,target,actionTime,endTime){
        if(!PKVideoCon.getInstance().stage)
            return;
        if(this['atkMV' + mid])
            this['atkMV' + mid](user,target,actionTime,endTime)
    }
    public mSkillMV(mid,user,target,actionTime,endTime){
        if(!PKVideoCon.getInstance().stage)
            return;
        if(this['skillMV' + mid])
            this['skillMV' + mid](user,target,actionTime,endTime)
    }

    public sSkillMV(mid,target:PKMonsterData){
        if(!PKVideoCon.getInstance().stage)
            return;
        if(this['skillMV' + mid])
            this['skillMV' + mid](target)
    }

    public hpSkillMV(id,teamData,scale){
        if(!PKVideoCon.getInstance().stage)
            return;
        var sBase = SBase.getData(id)
        var mc = teamData.atkRota == PKConfig.ROTA_LEFT?PKTopUI.getInstance().hpGroup1:PKTopUI.getInstance().hpGroup2
        var AM = AniManager.getInstance();
        var mvMC = AM.playOnItem(sBase.mvID1,mc,{x:mc.x + mc.width/2,y:mc.y + mc.height/2});
        if(mvMC)
            mvMC.scaleX = mvMC.scaleX = scale//0.8
    }

    //通用技能表现1
    private skillMVType1(id,target,marge=0){
        var sBase = SBase.getData(id)
        var mv = this.playAniOn(target.id,sBase.mvID1)
        if(mv && marge)
            mv.y -= marge;
        return mv;
    }
    //通用技能表现2
    private skillMVType2(id,target){
        var sBase = SBase.getData(id)
        var mv = this.playAniOn(target.id,sBase.mvID1)
        var marge = MonsterVO.getObject(target.mid).height/2
        if(mv && marge)
        {
            mv.y -= marge;
            mv.scaleX = mv.scaleY = 0.6
        }
        return mv;
    }


    ////////////////////////////////////////////////////////////////
    private atkMV1(user,target,actionTime,endTime){
        var mBase = MBase.getData(1)
       this.playAniOn(target.id,mBase.mvID1)
    }


    private atkMV3(user,target,actionTime,endTime){
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

    //private atkMV10(user,target,actionTime,endTime){
    //    var mBase = MBase.getData(10)
    //    var mv = this.playAniOn(target.id,mBase.mvID1)
    //    if(mv)
    //    {
    //        mv.scaleX = mv.scaleY = 1;
    //        mv.x -= 10
    //        mv.y -= 30
    //        console.log( mv.scaleX)
    //    }
    //}

    private atkMV31(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,5)
    }

    private atkMV32(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,7)
    }

    private atkMV33(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,1)
    }

    private atkMV34(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,3)
    }

    private atkMV35(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,2)
    }

    private atkMV38(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,9)
    }
    private atkMV43(user,target,actionTime,endTime){
        var mBase = MBase.getData(43)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV44(user,target,actionTime,endTime){
        var mBase = MBase.getData(44)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV45(user,target,actionTime,endTime){
        var mBase = MBase.getData(45)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV46(user,target,actionTime,endTime){
        var mBase = MBase.getData(46)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC = <BulletAniMC>(PKBulletManager.getInstance().createBulletAni(userItem,targetItem,actionTime,endTime,mBase.mvID2))
        mc.needRota = false
        mc.targetOffsetY = target.getVO().height/2
        mc.mc.scaleX = mc.mc.scaleY = 0.6          //@ani scale
    }

    private atkMV47(user,target,actionTime,endTime){
        var mBase = MBase.getData(47)
        this.playAniOn(target.id,mBase.mvID1)
    }

    private atkMV48(user,target,actionTime,endTime){
        var mBase = MBase.getData(48)
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc = this.playAniOn(user.id,mBase.mvID1)
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
    }

    public atkMV61(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV62(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV63(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV64(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createArrow(userItem,targetItem,actionTime,endTime)
    }

    public atkMV68(user,target,actionTime,endTime){
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

    public atkMV70(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }

    public atkMV72(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC2 = <BulletAniMC2>(PKBulletManager.getInstance().createBulletAni2(userItem,targetItem,actionTime,endTime))
        mc.mc.anchorOffsetX = 560/4/2
        mc.mc.anchorOffsetY = 90
        mc.targetOffsetY = target.getVO().height/2
        if(userItem.x > targetItem.x)
            mc.mc.scaleX = 1
        else
            mc.mc.scaleX = -1
        mc.mc.load(Config.localResRoot + 'monster/enemy72_attack.png',0,560,90)
        mc.mc.play()
    }

    public atkMV74(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        var mc:BulletAniMC2 = <BulletAniMC2>(PKBulletManager.getInstance().createBulletAni2(userItem,targetItem,actionTime,endTime))
        mc.mc.anchorOffsetX = 560/4/2
        mc.mc.anchorOffsetY = 90
        mc.targetOffsetY = target.getVO().height/2
        if(userItem.x > targetItem.x)
            mc.mc.scaleX = 1
        else
            mc.mc.scaleX = -1
        mc.mc.load(Config.localResRoot + 'monster/enemy72_attack.png',0,560,90)
        mc.mc.play()
    }

    public atkMV75(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = {
            x: user.x + user.atkRota * user.getSkillValue(1),
            y:user.y
        }
        PKBulletManager.getInstance().createBulletLine(userItem,targetItem,actionTime,endTime,'pk_arrow_1_png')
    }

    public atkMV76(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        egret.Tween.get(userItem).to({x:userItem.x + user.atkRota*50},300)
    }


    ////////////////////////////////////////////////////////////////
    public skillMV1(user,target,actionTime,endTime){
        this.atkMV1(user,target,actionTime,endTime)
    }

    public skillMV3(user,target,actionTime,endTime){
        this.atkMV3(user,target,actionTime,endTime)
    }

    public skillMV8(user,target,actionTime,endTime){
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD_STATE,
            user:target,
            key:'change',
            stateType:0
        })
    }

    //技能动画
    public skillMV10(user,target,actionTime,endTime){
        var mBase = MBase.getData(10)
        var mv = this.playAniOn(target.id,mBase.mvID1)
        if(mv)
        {
            //mv.scaleX = mv.scaleY = 0.8;
            //mv.x -= 10
            mv.y -= 40
        }

    }

    private skillMV38(user,target,actionTime,endTime){
        var userItem = PKVideoCon.getInstance().getItemByID(user.id);
        var targetItem = PKVideoCon.getInstance().getItemByID(target.id);
        PKBulletManager.getInstance().createBullet(userItem,targetItem,actionTime,endTime,10)
    }







    ////////////////////////////////////////////////////////////////
    public skillMV101(user,target,actionTime,endTime){
        var mBase = MBase.getData(101)
        if(user.useingHeroSkill == 1 || user.useingHeroSkill == 2)
            this.playAniOn(target.id,mBase.mvID1)
    }

    ////////////////////////////////////////////////////////////////


    public skillMV203(target:PKMonsterData){
        this.skillMVType1(203,target)
    }

    //public skillMV210(target:PKMonsterData){
    //    var sBase = SBase.getData(210)
    //    var mv = this.playAniOn(target.id,sBase.mvID2)
    //    if(mv)
    //    {
    //        mv.scaleX = mv.scaleY = 0.5;
    //        mv.x -= 10
    //        mv.y -= 30
    //    }
    //}

    public skillMV211(target:PKMonsterData){
        this.skillMVType1(211,target)
    }

    public skillMV214(target:PKMonsterData){
        this.skillMVType1(214,target,50)
    }

    public skillMV215(target:PKMonsterData){
        this.skillMVType1(215,target,50)
    }

    public skillMV216(target:PKMonsterData){
        this.skillMVType1(216,target,50)
    }

    public skillMV222(target:PKMonsterData){
        this.skillMVType1(222,target,50)
    }

    public skillMV223(target:PKMonsterData){
        this.skillMVType1(223,target,40)
    }

    public skillMV226(target:PKMonsterData){
        this.skillMVType1(226,target)
    }

    public skillMV228(target:PKMonsterData){
        this.skillMVType1(228,target,40)
    }

    public skillMV249(target:PKMonsterData){
        this.skillMVType2(249,target)
    }
    public skillMV250(target:PKMonsterData){
        this.skillMVType2(250,target)
    }
    public skillMV251(target:PKMonsterData){
        this.skillMVType2(251,target)
    }
    public skillMV252(target:PKMonsterData){
        this.skillMVType2(252,target)
    }
    public skillMV253(target:PKMonsterData){
        this.skillMVType2(253,target)
    }
    public skillMV254(target:PKMonsterData){
        this.skillMVType2(254,target)
    }

    public skillMV256(target:PKMonsterData){
        this.skillMVType1(256,target,40)
    }
    public skillMV257(target:PKMonsterData){
        this.skillMVType1(257,target,40)
    }
    public skillMV258(target:PKMonsterData){
        this.skillMVType1(258,target,40)
    }

    public skillMV259(target:PKMonsterData){
        this.skillMVType1(259,target,40)
    }
    public skillMV260(target:PKMonsterData){
        this.skillMVType1(260,target,40)
    }
    public skillMV261(target:PKMonsterData){
        this.skillMVType1(261,target,40)
    }

    public skillMV262(target:PKMonsterData){
        this.skillMVType2(262,target)
    }
    public skillMV263(target:PKMonsterData){
        this.skillMVType2(263,target)
    }

}