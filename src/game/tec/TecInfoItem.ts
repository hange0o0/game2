class TecInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecInfoItemSkin";
    }

    private coinText: eui.Label;
    private img: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
        var isRed = false
        if(this.data.type == 'coin')
        {
            this.coinText.text = '金币  ×'+NumberUtil.addNumSeparator(this.data.num)+''
            isRed =  this.data.num >= UM.getCoin();
            this.img.source = MyTool.getPropCoin();
        }
        else if(this.data.type == 'lv')
        {
            this.coinText.text = '主城等级  LV.'+this.data.num+''
            isRed =  this.data.num >= TecManager.getInstance().getLevel(1);
            this.img.source = MyTool.getPropLevel();
        }
        else
        {
            var vo = PropVO.getObject(this.data.id);
            this.img.source = vo.getThumb();
            this.coinText.text = vo.propname + ' ×' + NumberUtil.addNumSeparator(this.data.num)
            isRed =  this.data.num >= PropManager.getInstance().getNum(this.data.id);
        }
        this.coinText.textColor = isRed?0xFF0000:0xFCDB79;
    }

}