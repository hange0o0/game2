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
    private awardMC: eui.Image;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        MailInfoUI.getInstance().show(this.data)
    }

    public dataChanged(){
         var content = JSON.parse(this.data.content);
        if(this.data.from_gameid == 'sys')
        {
            this.nameText.text = '系统邮件'
            this.headMC.setData('sys');
        }
        else
        {
            this.nameText.text = Base64.decode(content.nick)
            this.headMC.setData(content.head,content.type);
        }

        this.timeText.text = DateUtil.formatDate('MM-dd hh:mm:ss',DateUtil.timeToChineseDate(this.data.time))
        this.desText.text = MailManager.getInstance().getMailDes(this.data);

        this.redMC.visible = this.data.type > 100 && !this.data.stat;
        this.awardMC.visible = this.data.type > 100 && this.data.stat
    }

}