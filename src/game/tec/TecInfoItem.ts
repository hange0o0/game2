class TecInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecInfoItemSkin";
    }

    private redMC: eui.Rect;
    private nameText: eui.Label;
    private numText: eui.Label;
    private img: eui.Image;





    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
        var isRed = 1
        if(this.data.type == 'coin')
        {
            this.nameText.text = '金币'
            this.numText.text = '×'+NumberUtil.addNumSeparator(this.data.num)
            isRed =  UM.getCoin()/this.data.num;
            this.img.source = MyTool.getPropCoin();
        }
        else if(this.data.type == 'lv')
        {
            this.nameText.text = '主城等级  '
            this.numText.text = 'LV.' + this.data.num+''
            isRed =   TecManager.getInstance().getLevel(1)/this.data.num;
            this.img.source = MyTool.getPropLevel();
        }
        else
        {
            var vo = PropVO.getObject(this.data.id);
            this.img.source = vo.getThumb();
            this.nameText.text = vo.propname
            this.numText.text =  ' ×' + NumberUtil.addNumSeparator(this.data.num)
            isRed =   PropManager.getInstance().getNum(this.data.id)/this.data.num;
        }
        this.numText.textColor = isRed<1?0xFF0000:0xFCDB79;
        if(isRed<1)
        {
            this.redMC.width = isRed*this.width
            this.redMC.fillColor = 0xFF0000
        }
        else
        {
            this.redMC.width = 1/isRed*this.width
            this.redMC.fillColor = 0x00FF00
        }

    }

}