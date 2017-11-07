class FightUI extends game.BaseWindow {

    private static _instance: FightUI;
    public static get instance(): FightUI {
        if(!this._instance)
            this._instance = new FightUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FightUISkin";
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