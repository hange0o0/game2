class RankUI extends game.BaseUI {

    private static _instance: RankUI;
    public static getInstance(): RankUI {
        if(!this._instance)
            this._instance = new RankUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "RankUISkin";
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