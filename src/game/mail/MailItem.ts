class MailItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MailItemSkin";
    }

    private nameText: eui.Label;
    private headMC: HeadMC;
    private timeText: eui.Label;
    private desText: eui.Label;
    private redMC: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        MailInfoUI.getInstance().show(this.data)
    }

    public dataChanged(){
         var content = JSON.parse(this.data.content);
        this.nameText.text = Base64.decode(content.nick)
        this.headMC.setData(this.data.head,this.data.type);
        this.timeText.text = DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time))
        this.redMC.visible = false;
        this.desText.text = MailManager.getInstance().getMailDes(this.data);
    }

}