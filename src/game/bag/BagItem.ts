class BagItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BagItemSkin";
    }

    private mc: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        if(this.data.coin)
        {
            this.nameText.text = '金币  (×'+NumberUtil.addNumSeparator(this.data.coin)+')'
            this.desText.text =  '金币用途很广，所有的科技升级都要用到。';
            this.mc.source = MyTool.getPropCoin();
        }
        else
        {
            this.nameText.text = this.data.propname + '  (×'+NumberUtil.addNumSeparator(PropManager.getInstance().getNum(this.data.id))+')'
            this.desText.text =  this.data.propdes;
            this.mc.source = this.data.getThumb();
        }

    }

}




