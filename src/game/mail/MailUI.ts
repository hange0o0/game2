class MailUI extends game.BaseUI {

    private static _instance: MailUI;
    public static getInstance(): MailUI {
        if(!this._instance)
            this._instance = new MailUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "MailUISkin";
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