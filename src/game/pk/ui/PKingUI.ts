class PKingUI extends game.BaseUI {
    private static instance:PKingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKingUI();
        return this.instance;
    }

    private scroller: eui.Scroller;
    private pkCtrlCon: PKCtrlCon;
    private pkTop: PKTopUI;
    private roundText: eui.Label;
    private con: eui.Group;
    private pkInfo: PKMonsterInfoUI;
    private smallMap: PKSmallMap;













    public scrollTime = 0;
    public counting = false;
    public tw:egret.Tween;

    public constructor() {
        super();
        this.skinName = "PKingUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
    }

    private onScroll(){
       this.scrollTime = TM.now();
    }

    public hide(){
        super.hide();
        this.removeAll();
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
        EM.dispatchEventWith(GameEvent.client.pk_end)
    }

    public show(){
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
        tw.set({y:this.pkTop.y-200}).to({y:this.pkTop.y},500).wait(200).call(()=>{
            this.pkTop.appearMV()
        },this)
        var tw = egret.Tween.get(this.pkCtrlCon)
        tw.set({bottom:-500}).to({bottom:0},500)

        var tw = egret.Tween.get(this.scroller)
        tw.set({alpha:0}).wait(100).to({alpha:1},600).wait(300).call(this.startPlay,this);
    }

    public onShow(){
        EM.dispatchEventWith(GameEvent.client.pk_begin)

        this.scrollTime = 0;
        PKVideoCon.getInstance().init();
        this.pkCtrlCon.init();
        this.pkTop.init('PK对战');
        this.smallMap.visible = false;

        this.con.addChild(PKVideoCon.getInstance())
        PKVideoCon.getInstance().x = 0;
        PKVideoCon.getInstance().y = 0;



        this.scroller.viewport.scrollH = (PKConfig.floorWidth + PKConfig.appearPos*2-640)/2
        this.scroller.touchEnabled = this.scroller.touchChildren = false;
        this.counting = true;
        this.roundText.text = '5'
        this.roundText.alpha = 1;
        this.roundText.y = GameManager.stage.stageHeight - 680;
        this.addChild(this.roundText);
        this.roundText.scaleX =  this.roundText.scaleY = 0;
        egret.Tween.removeTweens(this.roundText)
        this.showMV();
    }

    public startPlay(){
        this.hideBehind = true;
        PKBeforeUI.getInstance().hide();

        var tw = this.tw = egret.Tween.get(this.roundText)
        tw.to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '4'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '3'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '2'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '1'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = 'START';this.startGame();this.tw = null}).to({
                alpha:0,scaleX:2,scaleY:2
            },500).call(()=>{MyTool.removeMC(this.roundText)})

        this.onE();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public callFail(){
        egret.Tween.removeTweens(this.roundText)
        this.counting = false
        this.onE();
    }

    public startGame(){
        var PD = PKData.getInstance();
        PD.start();
        PD.diamondData = PD.addMonster({
            force:0,
            mid:99,
            owner:'sys',
            atkRota:1,
            x:PKConfig.floorWidth/2 + PKConfig.appearPos,
            y:0,
            actionTime:0
        });
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
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this);
            if(PD.isWin())
            {
                PKManager.getInstance().sendResult(()=>{
                    PKWinUI.getInstance().show();
                });
            }
            else
                PKFailUI.getInstance().show();
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
        else if(PD.diamondData.hp > 0)
        {
            var item = PKVideoCon.getInstance().getItemByID(PD.diamondData.id);
            area = 5;
        }
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