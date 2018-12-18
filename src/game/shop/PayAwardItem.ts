class PayAwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PayAwardItemSkin";
    }

    private img0: eui.Image;
    private img1: eui.Image;
    private img2: eui.Image;
    private img3: eui.Image;
    private costText: eui.Label;
    private barGroup: eui.Group;
    private barMC: eui.Image;
    private awardBtn: eui.Button;
    private numText: eui.Label;




    private num = 0
    public childrenCreated() {
        super.childrenCreated();
        this.img0.source = MyTool.getPropBox(24)
        this.img1.source = MyTool.getSkillBox(2)
        this.img2.source = MyTool.getHeroBox(2)
        this.img3.source = PropVO.getObject(101).getThumb()
        this.addBtnEvent(this.awardBtn,this.onClick)
    }

    private onClick(){
        if(!this.num)
        {
            MyWindow.ShowTips('暂无抽奖次数')
            return;
        }
        PayManager.getInstance().getPayAward(()=>{
            this.renew();
        })
    }

    public renew(){
        var PM = PayManager.getInstance();
        this.barMC.width = 204 *PM.getAwardRate()/30
        this.costText.text= PM.getAwardRate() + '/' + 30

        this.num = PM.getAwardNum() - ActiveManager.getInstance().rmb_award
        this.numText.text = '已消费 '+UM.rmb+' 元，剩余抽奖 '+this.num+' 次'
        this.awardBtn.label = '随机抽奖（'+this.num+'）'
    }

}