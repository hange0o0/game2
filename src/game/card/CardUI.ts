class CardUI extends game.BaseUI {

    private static _instance: CardUI;
    public static get instance(): CardUI {
        if(!this._instance)
            this._instance = new CardUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CardUISkin";
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