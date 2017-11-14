class UserInfoUI extends game.BaseWindow {

    private static _instance: UserInfoUI;
    public static getInstance(): UserInfoUI {
        if(!this._instance)
            this._instance = new UserInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "UserInfoUISkin";
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