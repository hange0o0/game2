class CardUI extends MainBase {

    private static _instance: CardUI;
    public static getInstance(): CardUI {
        if(!this._instance)
            this._instance = new CardUI();
        return this._instance;
    }

    private topUI: TopUI;

    public constructor() {
        super();
        this.skinName = "CardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.topUI.setTitle('卡牌')
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