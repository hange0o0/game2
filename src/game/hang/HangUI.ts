class HangUI extends game.BaseWindow {

    private static _instance: HangUI;
    public static getInstance(): HangUI {
        if(!this._instance)
            this._instance = new HangUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "HangUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public show(){
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

    }
}