class BagSellItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BagSellItemSkin";
    }

    private redMC: eui.Rect;
    private mc: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private okBtn: eui.Button;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
    }

    private onClick(){
        var propNum = PropManager.getInstance().getNum(this.data.id);
        if(this.data.type == 1 && propNum < this.data.num)
        {
            var pvo = PropVO.getObject(this.data.id);
            MyWindow.Alert('【' + pvo.propname + '】数量不足\n需求数量：' + this.data.num+ '\n当前拥有：' + propNum)
            return;
        }
        var coin = UM.getCoin()
        if(this.data.type == 2 && coin < (this.data.diamond))
        {
            MyWindow.Alert('金币数量不足\n需求数量：' + this.data.diamond+ '\n当前拥有：' + coin)
            return;
        }
        PropManager.getInstance().buySell(this.data.id,()=>{
            this.dataChanged()
        })
    }


    public dataChanged(){
        //{"id":1,"num":2,"type":1,"diamond":2002}
        var pvo = PropVO.getObject(this.data.id);
        if(this.data.type == 1)
        {
            var propNum = PropManager.getInstance().getNum(this.data.id);
            this.setHtml(this.nameText,this.createHtml('【求购】',0xFFDF7F) +  pvo.propname + ' x' + this.data.num)
            this.currentState = 'sell';
            this.desText.text = 'x' + NumberUtil.addNumSeparator(this.data.diamond);

            var isRed =  propNum/this.data.num;
        }
        else
        {
            this.setHtml(this.nameText,this.createHtml('【出售】',0xFF9630) +  pvo.propname + ' x' + this.data.num)
            this.currentState = 'buy';
            this.desText.text = 'x' + NumberUtil.addNumSeparator(this.data.diamond);

            var isRed = UM.getCoin()/this.data.diamond;
        }
        this.okBtn.visible = !this.data.isbuy
        this.mc.source = pvo.getThumb();



        if(isRed<1)
        {
            this.redMC.width = isRed*(this.width)
            this.redMC.fillColor = 0xFF0000
        }
        else
        {
            this.redMC.width = 1/isRed*(this.width)
            this.redMC.fillColor = 0x00FF00
        }
    }

}




