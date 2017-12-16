class PKingUI extends game.BaseUI {
    private static instance:PKingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKingUI();
        return this.instance;
    }

    private scroller: eui.Scroller;
    private pkVideo: PKVideoCon;
    private pkCtrlCon: PKCtrlCon;
    private pkTop: PKTopUI;
    private pkInfo: PKMonsterInfoUI;
    private roundText: eui.Label;












    public scrollTime = 0;
    public counting = false;

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
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public show(){
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        var PD = PKData.getInstance();
        this.scrollTime = 0;
        this.pkVideo.init();
        this.pkCtrlCon.init();
        this.pkTop.init('PK对战');



        PD.diamondData = PD.addMonster({
            force:0,
            mid:99,
            owner:'sys',
            atkRota:1,
            x:PKConfig.floorWidth/2 + PKConfig.appearPos,
            y:0,
            actionTime:0
        });

        this.scroller.viewport.scrollH = (1500-640)/2
        this.counting = true;
        this.roundText.text = '5'
        this.roundText.alpha = 1;
        this.roundText.y = GameManager.stage.stageHeight - 720;
        this.addChild(this.roundText);
        this.roundText.scaleX =  this.roundText.scaleY = 0;
        egret.Tween.removeTweens(this.roundText)
        var tw = egret.Tween.get(this.roundText)
        tw.to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '4'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '3'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '2'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = '1'})
            .to({scaleX:0,scaleY:0}).to({scaleX:1.3,scaleY:1.3},300).to({scaleX:1,scaleY:1},300).wait(400).call(()=>{this.roundText.text = 'START';this.startGame()}).to({
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
        this.counting = false;

    }

    public onE(){
        var PC = PKCode.getInstance()
        var PD = PKData.getInstance()
        var isOver = false;
        if(!this.counting)
            isOver = PC.onStep()     //跑数据

        //表现动画
        this.pkVideo.action();

        //控制栏动画
        this.pkCtrlCon.onTimer();

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
        if(PD.diamondData.hp > 0)
        {
            var item = this.pkVideo.getItemByID(PD.diamondData.id);
            area = 5;
        }
        else
            var item = this.pkVideo.getFirstItem(PKData.getInstance().myPlayer.teamData.id);
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