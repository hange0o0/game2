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
        if(this.infoData.version != Config.pk_version)
        {
            MyWindow.Confirm('该录像的生成时间为版本调整之前，\n其对战结果可能与当前描述不一致，\n是否仍继续观看？',(b)=>{
                if(b==1)
                {
                    this.view();
                }
            },['取消', '观看']);
            return;
        }
        this.view();
    }
    private view(){
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
        this.cdText.text = '通关时长：'+  DateUtil.getStringBySecond(this.infoData.cd/1000).substr(-5)

        this.timeText.text = DateUtil.getStringBySeconds(Math.max(TM.now() - this.data.time,1),true) + '前'

        if(this.infoData.version != Config.pk_version)
        {
              this.btn.skinName = 'Btn2Skin'
        }
        else
        {
            this.btn.skinName = 'Btn1Skin'
        }

    }

}