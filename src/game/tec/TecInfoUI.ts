class TecInfoUI extends game.BaseWindow {

    private static _instance: TecInfoUI;
    public static get instance(): TecInfoUI {
        if(!this._instance)
            this._instance = new TecInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "TecInfoUISkin";
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