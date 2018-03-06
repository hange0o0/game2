class MainFightUI extends MainBase {

    private static _instance:MainFightUI;

    public static getInstance():MainFightUI {
        if(!this._instance)
            this._instance = new MainFightUI();
        return this._instance;
    }


    private scroller: eui.Scroller;
    private mailBtn: eui.Group;
    private rankBtn: eui.Group;
    private shopBtn: eui.Group;
    private settingBtn: eui.Group;
    private mapBtn: HangUI;
    private testBtn: eui.Rect;
    private bottomGroup: eui.Group;
    private defBtn: eui.Button;
    private atkBtn: eui.Button;





    private hideTopState

    public constructor() {
        super();
        this.skinName = "MainFightUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.defBtn, this.onDef)
        this.addBtnEvent(this.atkBtn, this.onAtk)

        //this.addBtnEvent(this.mapBtn, this.onMap)
        this.addBtnEvent(this.testBtn, this.onTest)
        this.addBtnEvent(this.mailBtn, this.onMail)
        this.addBtnEvent(this.rankBtn, this.onRank)
        this.addBtnEvent(this.shopBtn, this.onShop)
        this.addBtnEvent(this.settingBtn, this.onSetting)

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)

    }

    public setTopPos(scrollV){
        if(this.hideTopState)
        {
            if(scrollV >= 30)
                return;
        }
        else if(scrollV <= 50)
            return;

        this.hideTopState = !this.hideTopState
        egret.Tween.removeTweens(this.bottomGroup)
        var tw = egret.Tween.get(this.bottomGroup)
        if(this.hideTopState)
            tw.to({bottom:-130},Math.abs(this.bottomGroup.bottom - (-130))*2)
        else
            tw.to({bottom:25},Math.abs(this.bottomGroup.bottom - (25))*2)
    }

    private onScroll(){
        MainUI.getInstance().setTopPos(this.scroller.viewport.scrollV)
        this.setTopPos(this.scroller.viewport.scrollV)
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

        this.renew();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.pos_change,this.renewPosBtn)

        this.addPanelOpenEvent(GameEvent.client.pk_begin,this.onPKBegin)
        this.addPanelOpenEvent(GameEvent.client.pk_end,this.onPKEnd)
        //this.addPanelOpenEvent(GameEvent.client.hang_change,this.onPKEnd)
    }

    public onPKBegin(){
        this.mapBtn.clean()
    }
    public onPKEnd(){
        this.mapBtn.renew()
    }

    private renewPosBtn(){
        var PM = PosManager.getInstance();
        this.defBtn.label = '防守阵容 ' + ObjectUtil.objLength(PM.defList) + '/' + PM.maxNum
        this.atkBtn.label = '进攻阵容 ' + ObjectUtil.objLength(PM.atkList) + '/' + PM.maxNum
    }

    private onTimer(){
        this.mapBtn.onTimer()
    }



    public renew(){
        egret.Tween.removeTweens(this.bottomGroup)
        this.bottomGroup.bottom = 25
        this.scroller.viewport.scrollV = 0;

        this.renewPosBtn();
        this.renewHang();
    }

    public renewHang(){
        this.mapBtn.renew();
    }
    public hide(){
        super.hide()
        this.mapBtn.clean()
    }
}