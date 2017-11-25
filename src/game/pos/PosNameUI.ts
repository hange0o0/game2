class PosNameUI extends game.BaseWindow {

    private static _instance: PosNameUI;
    public static getInstance(): PosNameUI {
        if(!this._instance)
            this._instance = new PosNameUI();
        return this._instance;
    }

    private nameText: eui.TextInput;
    private okBtn: eui.Button;
    private closeBtn: eui.Image;


    public constructor() {
        super();
        this.skinName = "PosNameUISkin";
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