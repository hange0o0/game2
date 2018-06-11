class HangHelpItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HangHelpItemSkin";
    }

    private headMC: HeadMC;
    private nameGroup: eui.Group;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private cdText: eui.Label;
    private btn: eui.Button;
    private timeText: eui.Label;





    public infoData
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.btn,this.onClick)
        this.addBtnEvent(this.headMC,this.onInfo)
    }

    private onClick(){
         HangManager.getInstance().getVideo(this.data.id,this.data.time)
    }
    private onInfo(){
         OtherInfoUI.getInstance().show(this.infoData.gameid)
    }

    public dataChanged(){
        this.infoData = JSON.parse(this.data.info);

        this.nameText.text = Base64.decode(this.infoData.nick)
        MyTool.setTypeImg(this.typeMC,this.infoData.type)
        this.nameGroup.addChildAt(this.typeMC,0)
        this.headMC.setData(this.infoData.head,this.infoData.type);
        this.forceText.text = '通关战力：'+  this.infoData.force
        this.cdText.text = '通关时间：'+  MyTool.toFixed(this.infoData.cd/1000,1) + '秒'

        this.timeText.text = DateUtil.getStringBySeconds(Math.max(TM.now() - this.data.time,1),true) + '前'
    }

}