class SettingUI extends game.BaseWindow {

    private static _instance: SettingUI;
    public static getInstance(): SettingUI {
        if(!this._instance)
            this._instance = new SettingUI();
        return this._instance;
    }

    private headMC: HeadMC;
    private nameText: eui.Label;
    private idText: eui.Label;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private effectCB: eui.CheckBox;
    private musicCB: eui.CheckBox;
    private versionText: eui.Label;
    private logBtn: eui.Label;
    private qqText: eui.Label;


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