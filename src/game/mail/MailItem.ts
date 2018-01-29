class MailItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MailItemSkin";
    }

    private nameText: eui.Label;
    private timeText: eui.Label;
    private type: eui.Image;
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
        this.type.source = MyTool.getTypeImg(content.type)
        this.timeText.text = DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time))
        this.redMC.visible = false;
        this.desText.text = MailManager.getInstance().getMailDes(this.data);
    }

}