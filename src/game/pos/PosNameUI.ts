class PosNameUI extends game.BaseWindow {

    private static _instance: PosNameUI;
    public static getInstance(): PosNameUI {
        if(!this._instance)
            this._instance = new PosNameUI();
        return this._instance;
    }

    private nameText: eui.TextInput;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;


    private lastName;
    public constructor() {
        super();
        this.skinName = "PosNameUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onOK)
        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    private onOK(){
        if(!this.nameText.text)
        {
            MyWindow.Alert('还没输入名称')
            return;
        }
        this.dispatchEventWith('nameChange',false,this.nameText.text);
        this.hide();
    }

    public show(v?){
        this.lastName = v;
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
        this.nameText.text = this.lastName;
    }
}