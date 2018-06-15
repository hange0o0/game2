class PKingUI extends game.BaseUI {
    private static instance:PKingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKingUI();
        return this.instance;
    }

    public scroller: eui.Scroller;
    public pkCtrlCon: PKCtrlCon;
    public pkTop: PKTopUI;
    private roundText: eui.Label;
    private con: eui.Group;
    private pkInfo: PKMonsterInfoUI;
    private smallMap: PKSmallMap;

    private vsGroup: eui.Group;
    private vsMC: eui.Image;
    private playerGroup1: eui.Group;
    private headMC1: HeadMC;
    private forceText1: eui.Label;
    private nameText1: eui.Label;
    private playerGroup2: eui.Group;
    private headMC2: HeadMC;
    private forceText2: eui.Label;
    private nameText2: eui.Label;

    private typeMC1: eui.Image;
    private typeMC2: eui.Image;



    private hurt1: eui.Image;
    private hurt2: eui.Image;





    public scrollTime = 0;
    public counting = false;
    public tw:egret.Tween;

    public constructor() {
        super();
        this.skinName = "PKingUISkin";
        this.LoadFiles = ['pk']
    }


    public childrenCreated() {
        super.childrenCreated();
        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }

    public onVideoEvent(e){
        if(!this.stage)
            return;
        //var item:PKMonsterItem;
        var videoData = e.data;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_WIN:
                var rota = videoData.user.getOwner().teamData.atkRota == PKConfig.ROTA_LEFT?PKConfig.ROTA_RIGHT:PKConfig.ROTA_LEFT
                this.showHurt(rota);
                break;
        }
    }

    private onScroll(){
       this.scrollTime = TM.now();
    }

    public addScroll(v){
        if(!this.scroller.touchEnabled)
            return;
        this.scroller.viewport.scrollH += v;
        if(this.scroller.viewport.scrollH < 0)
            this.scroller.viewport.scrollH = 0;
        else if(this.scroller.viewport.scrollH + this.scroller.viewport.width > this.scroller.viewport.contentWidth)
            this.scroller.viewport.scrollH  =  this.scroller.viewport.contentWidth - this.scroller.viewport.width
         this.onScroll();
    }

    public hide(){
        super.hide();
        SoundManager.getInstance().playSound(SoundConfig.bg);
        this.removeAll();
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
        EM.dispatchEventWith(GameEvent.client.pk_end)

        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().showGuide()
        }
    }

    public show(){
        EM.dispatchEventWith(GameEvent.client.pk_begin)
        this.hideBehind = false;
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public setStop(b){
        if(b)
        {
            if(this.tw)
                this.tw.setPaused(true)
            else
                PKData.getInstance().stop()
            return
        }
        if(this.tw)
            this.tw.setPaused(false)
        else
            PKData.getInstance().play()
    }

    public removeAll(){
        PKBulletManager.getInstance().freeAll()
        PKVideoCon.getInstance().remove();
        this.pkCtrlCon.remove();
        this.pkTop.remove();

        egret.Tween.removeTweens(this.pkTop)
        egret.Tween.removeTweens(this.pkCtrlCon)
        egret.Tween.removeTweens(this.smallMap)
        egret.Tween.removeTweens(this.scroller)
    }
    public showMV(){
        var tw = egret.Tween.get(this.pkTop)
        tw.set({y:this.pkTop.y-200}).to({y:this.pkTop.y},500)
        //    .wait(200).call(()=>{
        //    this.pkTop.appearMV()
        //},this)
        var tw = egret.Tween.get(this.pkCtrlCon)
        tw.set({bottom:-500}).to({bottom:0},500)

        var tw = egret.Tween.get(this.scroller)
        tw.set({alpha:0}).wait(100).to({alpha:1},600).wait(300).call(this.startPlay,this);
    }

    public onShow(){
        SoundManager.getInstance().playSound(SoundConfig.bg_pk);


        var PD = PKData.getInstance();

        this.scrollTime = 0;
        PKVideoCon.getInstance().init();
        this.pkCtrlCon.init();
        this.pkTop.init('PK对战');
        this.smallMap.visible = false;

        this.con.addChild(PKVideoCon.getInstance())
        PKVideoCon.getInstance().x = 0;
        PKVideoCon.getInstance().y = 0;

        var vY = this.pkTop.y + 170;
        var vH = GameManager.stage.stageHeight - 480 - vY



        var hurtY = (vH - 320)/2 + vY - 30
        this.hurt1.y = this.hurt2.y = hurtY;


        this.scroller.viewport.scrollH = (PKConfig.floorWidth + PKConfig.appearPos*2-640)/2
        this.scroller.touchEnabled = this.scroller.touchChildren = false;
        this.counting = true;
        this.roundText.text = '3'
        this.roundText.alpha = 1;
        this.roundText.skewX = 0;
        this.roundText.y = vY + vH/6*2
        this.addChild(this.roundText);
        this.roundText.scaleX =  this.roundText.scaleY = 0;
        egret.Tween.removeTweens(this.roundText)

        this.vsGroup.visible = false
        this.vsGroup.y =  vY + vH/2
        egret.Tween.removeTweens(this.vsMC)
        egret.Tween.removeTweens(this.playerGroup1)
        egret.Tween.removeTweens(this.playerGroup2)
        var player = PD.getTeamByRota(PKConfig.ROTA_LEFT).members[0]
        this.nameText1.text = player.nick
        this.forceText1.text = player.force
        this.headMC1.setData(player.head,player.type)
        MyTool.setTypeImg(this.typeMC1,player.type)


        player = PD.getTeamByRota(PKConfig.ROTA_RIGHT).members[0]
        this.nameText2.text = player.nick
        this.forceText2.text = player.force
        this.headMC2.setData(player.head,player.type)
        MyTool.setTypeImg(this.typeMC2,player.type)

        this.hurt1.visible = false
        this.hurt2.visible = false
        egret.Tween.removeTweens(this.hurt1)
        egret.Tween.removeTweens(this.hurt2)

        this.showMV();

        if(GuideManager.getInstance().isGuiding)
            GuideUI.getInstance().hide();
    }

    public showHurt(rota){
        var mc;
         if(rota == PKConfig.ROTA_LEFT)
             mc = this.hurt1
        else
             mc = this.hurt2


        egret.Tween.removeTweens(mc);
        mc.visible = true
        mc.alpha = 0
        egret.Tween.get(mc).to({alpha:1},150).to({alpha:0},150).call(function(){
            mc.visible = false
        },this)
    }

    public startPlay(){
        SoundManager.getInstance().loadPKSound();
        this.hideBehind = true;
        PKBeforeUI.getInstance().hide();

        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().showGuide()
        }
        else
        {
            this.showCountDown();
        }
        this.onE();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public showCountDown(){
        this.vsGroup.visible = true
        this.vsMC.scaleX = this.vsMC.scaleY = 2
        this.vsMC.alpha = 0
        this.playerGroup1.x = -280
        this.playerGroup2.right = -280

        egret.Tween.get(this.vsMC).to({scaleX:0.4,scaleY:0.4,alpha:1},200).to({scaleX:0.5,scaleY:0.5},200)
        egret.Tween.get(this.playerGroup1).to({x:20},200).to({x:0},200)
        egret.Tween.get(this.playerGroup2).to({right:20},200).to({right:0},200)

        var tw = this.tw = egret.Tween.get(this.roundText)
        tw.wait(800).to({scaleX:1.8,scaleY:1.8},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '2'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.8,scaleY:1.8},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '1'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.8,scaleY:1.8},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{
                this.roundText.text = '';
                egret.Tween.get(this.vsMC).to({scaleX:0.6,scaleY:0.6},200).to({scaleX:0,scaleY:0},200)
                egret.Tween.get(this.playerGroup1).to({x:20},200).to({x:-280},200)
                egret.Tween.get(this.playerGroup2).to({right:20},200).to({right:-280},200)
                this.startGame();
                this.tw = null}).wait(500).call(()=>{
                MyTool.removeMC(this.roundText);
                this.vsGroup.visible = false
                this.pkTop.appearMV();
                this.pkCtrlCon.initInfo();
                if(GuideManager.getInstance().isGuiding)
                {
                    this.setStop(true);
                    GuideManager.getInstance().showGuide()
                }
            })
    }

    public callFail(){
        egret.Tween.removeTweens(this.roundText)
        this.counting = false
        this.onE();
    }

    public startGame(){
        var PD = PKData.getInstance();
        PD.start();
        //PD.addDiamondMonster();

        this.counting = false;
        this.scroller.touchEnabled = this.scroller.touchChildren = true;
        this.smallMap.visible = true;
        var tw = egret.Tween.get(this.smallMap);
        tw.set({alpha:0}).to({alpha:1},500);
    }

    public onE(){
        var PC = PKCode.getInstance()
        var PD = PKData.getInstance()
        var isOver = false;
        if(!this.counting)
            isOver = PC.onStep()     //跑数据

        //表现动画
        PKVideoCon.getInstance().action();

        //控制栏动画
        this.pkCtrlCon.onTimer();
        this.smallMap.onTimer();

        //详情栏动画
        this.pkInfo.onTimer();

        if(isOver)
        {
            SoundManager.getInstance().playSound(SoundConfig.bg_pk_view);
            PKManager.getInstance().savePKResult();
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this);
            if(PD.isWin())
            {
                PKManager.getInstance().sendResult(()=>{
                    PKWinUI.getInstance().show();
                });
            }
            else
            {

                PKManager.getInstance().sendFail(()=>{
                    PKFailUI.getInstance().show();
                })
            }
            PKSettingUI.getInstance().hide();
        }
        else if(TM.now() - this.scrollTime > 10)
        {
            this.autoMoveScreen();
        }

    }

    private autoMoveScreen(){
        var PD = PKData.getInstance();
        var area = 100
        if(this.counting)
        {
            var item:any = {x:PKConfig.floorWidth/2 + PKConfig.appearPos};
            area = 5;
        }
        //else if(PD.diamondData.hp > 0)
        //{
        //    var item = PKVideoCon.getInstance().getItemByID(PD.diamondData.id);
        //    area = 5;
        //}
        else
            var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
        if(item)
        {
            var scrollH = item.x - 320;
            var des = Math.abs(this.scroller.viewport.scrollH - scrollH)
            if(des < area)
                return;
            if(this.scroller.viewport.scrollH > scrollH)
                scrollH = this.scroller.viewport.scrollH - Math.pow(des - (area*0.9),0.5)
            else
                scrollH = this.scroller.viewport.scrollH + Math.pow(des - (area*0.9),0.5)

            if(scrollH < 0)
                scrollH = 0;
            else if(scrollH + this.scroller.viewport.width > this.scroller.viewport.contentWidth)
                scrollH  =  this.scroller.viewport.contentWidth - this.scroller.viewport.width
            this.scroller.viewport.scrollH = scrollH
        }
    }






}