class SlaveChooseUI extends game.BaseWindow {

    private static _instance: SlaveChooseUI;
    public static getInstance(): SlaveChooseUI {
        if(!this._instance)
            this._instance = new SlaveChooseUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "SlaveChooseUISkin";
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