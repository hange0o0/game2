class TecUI extends game.BaseWindow {

    private static _instance: TecUI;
    public static get instance(): TecUI {
        if(!this._instance)
            this._instance = new TecUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "TecUISkin";
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