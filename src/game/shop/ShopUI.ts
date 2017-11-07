class ShopUI extends game.BaseUI {

    private static _instance: ShopUI;
    public static get instance(): ShopUI {
        if(!this._instance)
            this._instance = new ShopUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "ShopUISkin";
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