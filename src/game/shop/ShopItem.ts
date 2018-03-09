class ShopItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopItemSkin";
    }


    private bg: eui.Image;
    private img: eui.Image;
    private nameText: eui.Label;
    private diamondGroup: eui.Group;
    private diamondIcon: eui.Image;
    private diamondText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data.isbuy)
            return;

        if(UM.diamond < this.data.diamond)
        {
            MyWindow.ShowTips('钻石不足！')
            return;
        }
        ShopBuyUI.getInstance().show(this.data)
        //
        //var str = '确定费'+this.data.diamond+'钻石购买以下道具？\n\n'+this.nameText.text.replace('\n',' ')+''
        //MyWindow.Confirm(str,(b)=>{
        //    if(b==1)
        //    {
        //        PayManager.getInstance().buy_shop(this.data.id,()=>{
        //            MyWindow.ShowTips('购买成功！')
        //            this.dataChanged()
        //        })
        //    }
        //})
    }

    public dataChanged(){
        var name = ''
        if(this.data.id == 'coin')
        {
            name = this.createHtml('金币',0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num);
            this.img.source = MyTool.getPropCoin()
        }
        else if(this.data.id == 'energy')
        {
            name = this.createHtml('体力',0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num);
            this.img.source = MyTool.getPropEnergy()
        }
        else
        {
            var vo = PropVO.getObject(this.data.id);
            name = this.createHtml(vo.propname,0xFFD27F) + '\n×' + this.data.num;
            this.img.source = vo.getThumb()

        }
        this.setHtml(this.nameText, name)
        if(this.data.isbuy)
        {
            this.diamondText.text =  '已售磬'
            this.diamondText.textColor = 0x87E7FF;
            MyTool.changeGray(this.img,true)
            MyTool.removeMC(this.diamondIcon);
        }
        else
        {
            MyTool.changeGray(this.img,false)
            this.diamondGroup.addChildAt(this.diamondIcon,0)
            this.diamondText.text = this.data.diamond
            this.diamondText.textColor = (UM.diamond < this.data.diamond)?0xFF0000:0xFFFFFF;
        }
    }

}