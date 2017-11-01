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










    public scrollTime = 0;

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
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)

        PKData.getInstance().start();
        this.scrollTime = 0;
        this.pkVideo.init();
        this.pkCtrlCon.init();
        this.pkTop.init();

        this.onE();
    }

    public onE(){
        var PC = PKCode.getInstance()
        var PD = PKData.getInstance()

        var isOver = PC.onStep()     //跑数据

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
                PKWinUI.getInstance().show();
            else
                PKFailUI.getInstance().show();

        }
        else if(TM.now() - this.scrollTime > 5)
        {
            this.autoMoveScreen();
        }

    }

    private autoMoveScreen(){
        var item = this.pkVideo.getFirstItem(PKData.getInstance().myPlayer.teamData.id);
        if(item)
        {
            var scrollH = item.x - 320;
            var des = Math.abs(this.scroller.viewport.scrollH - scrollH)
            if(des < 100)
                return;
            if(this.scroller.viewport.scrollH > scrollH)
                scrollH = this.scroller.viewport.scrollH - Math.pow(des - 90,0.5)
            else
                scrollH = this.scroller.viewport.scrollH + Math.pow(des - 90,0.5)

            if(scrollH < 0)
                scrollH = 0;
            else if(scrollH + this.scroller.viewport.width > this.scroller.viewport.contentWidth)
                scrollH  =  this.scroller.viewport.contentWidth - this.scroller.viewport.width
            this.scroller.viewport.scrollH = scrollH
        }
    }






}