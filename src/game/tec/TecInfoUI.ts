class TecInfoUI extends game.BaseWindow {

    private static _instance: TecInfoUI;
    public static getInstance(): TecInfoUI {
        if(!this._instance)
            this._instance = new TecInfoUI();
        return this._instance;
    }
    private mc: eui.Image;
    private levelText: eui.Label;
    private nameText: eui.Label;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private desText: eui.Label;
    private list: eui.List;
    private btnGroup: eui.Group;




    public dataIn
    public constructor() {
        super();
        this.skinName = "TecInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)

        this.list.itemRenderer = TecInfoItem

    }

    private onClick(){
        TecManager.getInstance().tec_up(this.dataIn.id,()=>{
            this.hide()
        });
    }

    public show(v?){
        this.dataIn = v;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){

        this.levelText.text = 'LV.' + TecManager.getInstance().getLevel(this.dataIn.id)
        this.nameText.text = this.dataIn.name;
        this.mc.source = this.dataIn.getThumb();
        this.desText.text = this.dataIn.des

        var arr = TecManager.getInstance().getLevelUpCost(this.dataIn.id);
        this.list.dataProvider = new eui.ArrayCollection(arr)
        if(TecManager.getInstance().testRed(this.dataIn.id))
            this.btnGroup.addChild(this.okBtn);
        else
            MyTool.removeMC(this.okBtn);
    }
}