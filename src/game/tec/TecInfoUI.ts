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
        this.hide()
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
        this.nameText.text = ''
        this.desText.text = ''
        this.levelText.text = 'LV.1'

        this.mc.source = Config.localResRoot + 'head/m_head'+1+'.jpg';

        var arr = [1,2,3];
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}