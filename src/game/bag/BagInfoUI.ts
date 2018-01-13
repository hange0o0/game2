class BagInfoUI extends game.BaseWindow {

    private static _instance: BagInfoUI;
    public static getInstance(): BagInfoUI {
        if(!this._instance)
            this._instance = new BagInfoUI();
        return this._instance;
    }

    private nameText: eui.Label;
    private desText: eui.Label;
    private mc: eui.Image;


    public constructor() {
        super();
        this.skinName = "BagInfoUISkin";
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
        this.nameText.text = ''
        this.desText.text = ''
        this.mc.source = ''
    }
}
