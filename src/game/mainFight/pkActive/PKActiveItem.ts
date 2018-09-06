class PKActiveItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKActiveItemSkin";
    }


    private bg: eui.Image;
    private img: eui.Image;
    private nameText: eui.Label;
    private cardMC: CardImg;



    private skillID
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.skillID)
        {
            CardInfoUI.getInstance().show(CM.getCardVO(this.skillID));
            return;
        }
    }

    public dataChanged(){
        this.skillID = this.data.skillID
        if(this.skillID)
        {
            this.currentState = 'card'
            this.cardMC.data = this.skillID
        }
        else
        {
            this.currentState = 'prop'
            this.img.source = this.data.img;
        }
        if(this.data.num2)
            this.setHtml(this.nameText, this.createHtml(this.data.name,0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num2))
        else
            this.setHtml(this.nameText, this.createHtml(this.data.name,0xFFD27F)  + '\n' + this.data.num)
    }

}