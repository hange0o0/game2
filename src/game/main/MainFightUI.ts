class MainFightUI extends MainBase {

    private static _instance:MainFightUI;

    public static getInstance():MainFightUI {
        if(!this._instance)
            this._instance = new MainFightUI();
        return this._instance;
    }

    private bg: eui.Image;
    private forceText: eui.Label;
    private addForceBtn: eui.Image;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;
    private defBtn: eui.Button;
    private atkBtn: eui.Button;
    private mailBtn: eui.Group;
    private rankBtn: eui.Group;
    private shopBtn: eui.Group;
    private settingBtn: eui.Group;
    private mapBtn: HangUI;
    private testBtn: eui.Rect;




    public constructor() {
        super();
        this.skinName = "MainFightUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.defBtn, this.onDef)
        this.addBtnEvent(this.atkBtn, this.onAtk)
        this.addBtnEvent(this.addForceBtn, this.onAddForce)
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy)
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamond)
        //this.addBtnEvent(this.mapBtn, this.onMap)
        this.addBtnEvent(this.testBtn, this.onTest)
        this.addBtnEvent(this.mailBtn, this.onMail)
        this.addBtnEvent(this.rankBtn, this.onRank)
        this.addBtnEvent(this.shopBtn, this.onShop)
        this.addBtnEvent(this.settingBtn, this.onSetting)

    }

    private onTest(){
        HangManager.getInstance().pkTest(PosManager.getInstance().atkList[0].id)
    }

    private onMail(){

    }
    private onRank(){

    }
    private onShop(){

    }
    private onSetting(){
        MainUI.getInstance().hide();
        LoginUI.getInstance().show();
    }

    private onDef(){
        DefPosListUI.getInstance().show();
    }

    private onAtk(){
        AtkPosListUI.getInstance().show();
    }

    private onAddForce(){

    }

    private onAddEnergy(){

    }

    private onAddDiamond(){

    }

    //private onMap(){
    //    HangUI.getInstance().show();
    //}

    public onShow(){
        this.bg.source = Config.localResRoot  + 'main_bg'+UM.type+'.jpg';
        this.renew();
        this.renewHang();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renewEnergy)
        this.addPanelOpenEvent(GameEvent.client.pos_change,this.renewPosBtn)

        this.addPanelOpenEvent(GameEvent.client.pk_begin,this.onPKBegin)
        this.addPanelOpenEvent(GameEvent.client.pk_end,this.onPKEnd)
    }

    private onPKBegin(){
        this.mapBtn.clean()
    }
    private onPKEnd(){
        this.mapBtn.renew()
    }

    private renewPosBtn(){
        var PM = PosManager.getInstance();
        this.defBtn.label = '防守阵容 ' + PM.defList.length + '/' + PM.maxNum
        this.atkBtn.label = '进攻阵容 ' + PM.atkList.length + '/' + PM.maxNum
    }

    private onTimer(){
        this.renewEnergy();
        this.mapBtn.onTimer()
    }

    public renewTop(){
        this.forceText.text = UM.tec_force + ''
        this.diamondText.text = UM.diamond + ''
    }

    public renewEnergy(){
        var energy = UM.getEnergy();
        if(energy)
            this.energyText.text = energy + '/' + UM.maxEnergy;
        else
            this.setHtml(this.energyText,this.createHtml(DateUtil.getStringBySecond(UM.getNextEnergyCD()).substr(-5),0xFF0000));
    }

    public renew(){
        this.renewTop();
        this.renewEnergy();
        this.renewPosBtn();
    }

    public renewHang(){
        this.mapBtn.renew();
    }
    public hide(){
        super.hide()
        this.mapBtn.clean()
    }
}