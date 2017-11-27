class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static getInstance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }

    private forceText: eui.Label;
    private addForceBtn: eui.Image;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;
    private mapBtn: eui.Rect;
    private b0: MainBottomBtn;
    private b1: MainBottomBtn;
    private b2: MainBottomBtn;
    private b3: MainBottomBtn;
    private b4: MainBottomBtn;
    private defBtn: eui.Button;
    private atkBtn: eui.Button;


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
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renewEnergy)
    }

    private renewDefBtn(){
        var PM = PosManager.getInstance();
        this.defBtn.label = '防守阵容 ' + PM.defendList.length + '/' + PM.maxNum
    }

    private renewAtkBtn(){
        var PM = PosManager.getInstance();
        this.atkBtn.label = '进攻阵容 ' + PM.defendList.length + '/' + PM.maxNum
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
        this.renewDefBtn();
        this.renewAtkBtn();
    }
}