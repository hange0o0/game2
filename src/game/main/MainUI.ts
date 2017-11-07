class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static get instance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "MainUISkin";
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