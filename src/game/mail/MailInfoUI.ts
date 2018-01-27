class MailInfoUI extends game.BaseWindow {

    private static _instance: MailInfoUI;
    public static getInstance(): MailInfoUI {
        if(!this._instance)
            this._instance = new MailInfoUI();
        return this._instance;
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private list: eui.List;
    private titleText: eui.Label;
    private desText: eui.Label;



    public constructor() {
        super();
        this.skinName = "MailInfoUISkin";
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
