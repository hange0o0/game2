class MainFightUI extends MainBase {

    private static _instance:MainFightUI;

    public static getInstance():MainFightUI {
        if(!this._instance)
            this._instance = new MainFightUI();
        return this._instance;
    }


    private scroller: eui.Scroller;
    public mapBtn: HangUI;
    public forceGroup: eui.Group;
    private forceText: eui.Label;
    private shopBtn: eui.Group;
    private rankBtn: eui.Group;
    private mailBtn: eui.Group;
    private mailRed: eui.Image;
    private settingBtn: eui.Group;
    private activeUI: PKActiveMainPageUI;
    private defBtn: eui.Group;
    private atkBtn: eui.Group;











    private hideTopState

    public constructor() {
        super();
        this.skinName = "MainFightUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.defBtn, this.onDef)
        this.addBtnEvent(this.atkBtn, this.onAtk)

        this.addBtnEvent(this.forceGroup, this.onAddForce)

        this.addBtnEvent(this.mailBtn, this.onMail)
        this.addBtnEvent(this.rankBtn, this.onRank)
        this.addBtnEvent(this.shopBtn, this.onShop)
        this.addBtnEvent(this.settingBtn, this.onSetting)

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)

        EM.addEvent(GameEvent.client.pk_begin,this.onPKBegin,this)
        EM.addEvent(GameEvent.client.pk_end,this.onPKEnd,this)

        var h = GameManager.stage.stageHeight-140-110
        var mapH = Math.max(430,h/2)
        this.mapBtn.resetHeight(mapH)
        this.activeUI.resetHeight(Math.max(380,h-mapH))

        //this.defBtn.visible = false
        //this.atkBtn.visible = false

    }

    private onAddForce(){
        MainUI.getInstance().onBottomSelect(4,GuideManager.getInstance().isGuiding);
        TecUI.getInstance().setTab(1)
    }

    private renewRed(){
        this.mailRed.visible = MailManager.getInstance().getNotAwardNum() > 0;
    }




    //public setTopPos(scrollV){
    //    if(this.hideTopState)
    //    {
    //        if(scrollV >= 30)
    //            return;
    //    }
    //    else if(scrollV <= 50)
    //        return;
    //
    //    this.hideTopState = !this.hideTopState
    //    egret.Tween.removeTweens(this.bottomGroup)
    //    var tw = egret.Tween.get(this.bottomGroup)
    //    if(this.hideTopState)
    //        tw.to({bottom:-130},Math.abs(this.bottomGroup.bottom - (-130))*2)
    //    else
    //        tw.to({bottom:25},Math.abs(this.bottomGroup.bottom - (25))*2)
    //}

    private onScroll(){
        MainUI.getInstance().setTopPos(this.scroller.viewport.scrollV)
        //this.setTopPos(this.scroller.viewport.scrollV)
    }

    private onTest(){
        HangManager.getInstance().pkTest(PosManager.getInstance().atkList[0].id)
    }

    private onMail(){
         MailUI.getInstance().show();
    }
    private onRank(){
        RankUI.getInstance().show();
    }
    private onShop(){
         ShopUI.getInstance().show();
    }
    private onSetting(){
        SettingUI.getInstance().show()

        //MainUI.getInstance().hide();
        //LoginUI.getInstance().show();
    }

    private onDef(){
        BasePosUI.getInstance().show('def');
    }

    private onAtk(){
        BasePosUI.getInstance().show('atk');
    }



    //private onMap(){
    //    HangUI.getInstance().show();
    //}

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        this.renew();
        this.renewForce();
        this.renewRed();
        this.onHangChange();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.red_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewForce)
        this.addPanelOpenEvent(GameEvent.client.hang_change,this.onHangChange)
        this.addPanelOpenEvent(GameEvent.client.pvp_change,this.onPVPChange)

    }

    private onHangChange(){
         this.renewActive();
    }
    private onPVPChange(){
        this.renewActive();
    }

    private renewActive(){
        if(HangManager.getInstance().level >= Config.pvpLevel)
        {
            PKActiveManager.getInstance().getActive(()=>{
                this.activeUI.renew()
            })
        }
    }

    private renewForce(){
        this.forceText.text = UM.tec_force + ''
    }

    public onPKBegin(){
        this.mapBtn.clean()
    }
    public onPKEnd(){
        if(this.stage && MainUI.getInstance().visible)
            this.mapBtn.renew()

        //this.fightBtn.renew();
        //this.pvpBtn.renew();
    }


    private onTimer(){
        this.mapBtn.onTimer()
        this.activeUI.onTimer()
    }

    public onVisibleChange(b){
        this.activeUI.onVisibleChanged(b)
        if(b)
        {
            this.renewHang();

        }
        else
        {
            this.mapBtn.stop()
        }
    }



    public renew(){
        //egret.Tween.removeTweens(this.bottomGroup)
        //this.bottomGroup.bottom = 25
        this.scroller.viewport.scrollV = 0;
        this.renewHang();
        this.renewActive();

        //this.fightBtn.renew();
        //this.pvpBtn.renew();
    }

    public renewHang(){
        this.mapBtn.renew();
    }
    public hide(){
        super.hide()
        this.mapBtn.stop()
    }
}