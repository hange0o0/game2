class PKSettingUI extends game.BaseWindow {

    private static _instance: PKSettingUI;
    public static get instance(): PKSettingUI {
        if(!this._instance)
            this._instance = new PKSettingUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKSettingUISkin";
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