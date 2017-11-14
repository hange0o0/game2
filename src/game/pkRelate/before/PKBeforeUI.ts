class PKBeforeUI extends game.BaseWindow {

    private static _instance: PKBeforeUI;
    public static getInstance(): PKBeforeUI {
        if(!this._instance)
            this._instance = new PKBeforeUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKBeforeUISkin";
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