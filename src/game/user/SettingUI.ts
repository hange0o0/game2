class SettingUI extends game.BaseWindow {

    private static _instance: SettingUI;
    public static get instance(): SettingUI {
        if(!this._instance)
            this._instance = new SettingUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "SettingUISkin";
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