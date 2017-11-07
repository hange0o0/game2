class BagUI extends game.BaseUI {

    private static _instance: BagUI;
    public static get instance(): BagUI {
        if(!this._instance)
            this._instance = new BagUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "BagUISkin";
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