class ChangeHeadUI extends game.BaseWindow {

    private static _instance: ChangeHeadUI;
    public static getInstance(): ChangeHeadUI {
        if(!this._instance)
            this._instance = new ChangeHeadUI();
        return this._instance;
    }

    private list: eui.List;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;


    public constructor() {
        super();
        this.skinName = "SlaveChooseUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeHeadItem;
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    private onClick(){

    }

    public show(){
        SlaveManager.getInstance().slave_miss(()=>{
            super.show();
        })
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var SM =  SlaveManager.getInstance()
        var arr = SM.missList;
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}