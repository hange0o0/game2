class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static getInstance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }

    private bg: eui.Image;
    private forceText: eui.Label;
    private addForceBtn: eui.Image;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;
    private mapBtn: eui.Rect;
    private testBtn: eui.Rect;
    private b0: MainBottomBtn;
    private b1: MainBottomBtn;
    private b2: MainBottomBtn;
    private b3: MainBottomBtn;
    private b4: MainBottomBtn;
    private defBtn: eui.Button;
    private atkBtn: eui.Button;
    private mailBtn: eui.Group;
    private rankBtn: eui.Group;
    private shopBtn: eui.Group;
    private settingBtn: eui.Group;




    public constructor() {
        super();
        this.skinName = "MainUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.defBtn,this.onDef)
        this.addBtnEvent(this.atkBtn,this.onAtk)
        this.addBtnEvent(this.addForceBtn,this.onAddForce)
        this.addBtnEvent(this.addEnergyBtn,this.onAddEnergy)
        this.addBtnEvent(this.addDiamondBtn,this.onAddDiamond)
        this.addBtnEvent(this.mapBtn,this.onMap)
        this.addBtnEvent(this.testBtn,this.onTest)
        this.addBtnEvent(this.mailBtn,this.onMail)
        this.addBtnEvent(this.rankBtn,this.onRank)
        this.addBtnEvent(this.shopBtn,this.onShop)
        this.addBtnEvent(this.settingBtn,this.onSetting)

        this.b0.data = {text:'奴隶',source:'main_slave_png',fun:function(){}}
        this.b1.data = {text:'背包',source:'main_bag_png',fun:function(){}}
        this.b2.data = {text:'战斗',source:'main_pk_png',fun:function(){}}
        this.b3.data = {text:'卡牌',source:'main_card_png',fun:function(){}}
        this.b4.data = {text:'科技',source:'main_tec_png',fun:function(){}}
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

    private onMap(){
        HangUI.getInstance().show();
    }


    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.bg.source = Config.localResRoot  + 'main_bg'+UM.type+'.jpg';
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renewEnergy)
        this.addPanelOpenEvent(GameEvent.client.pos_change,this.renewPosBtn)
    }

    private renewPosBtn(){
        var PM = PosManager.getInstance();
        this.defBtn.label = '防守阵容 ' + PM.defList.length + '/' + PM.maxNum
        this.atkBtn.label = '进攻阵容 ' + PM.atkList.length + '/' + PM.maxNum
    }

    private onTimer(){
        this.renewEnergy();
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
}