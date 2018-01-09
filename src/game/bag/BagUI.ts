class BagUI extends MainBase {

    private static _instance: BagUI;
    public static getInstance(): BagUI {
        if(!this._instance)
            this._instance = new BagUI();
        return this._instance;
    }

    private topUI: TopUI;


    public constructor() {
        super();
        this.skinName = "BagUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('背包')
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