class AwardUI extends game.BaseWindow {

    private static _instance: AwardUI;
    public static get instance(): AwardUI {
        if(!this._instance)
            this._instance = new AwardUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "AwardUISkin";
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