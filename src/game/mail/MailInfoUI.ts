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


    public dataIn
    public constructor() {
        super();
        this.skinName = "MailInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    public onClick(){

    }

    public show(v?){
        this.dataIn = v
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
        var content = JSON.parse(this.dataIn.content);
        this.titleText.text = '【'+Base64.decode(content.nick) + '】的邮件'

        //this.timeText.text = DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time))
        this.desText.text = MailManager.getInstance().getMailDes(this.dataIn);
    }
}
