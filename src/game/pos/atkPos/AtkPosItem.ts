class AtkPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AtkPosItemSkin";
    }

    public selectMC: eui.Rect;
    private des: eui.Label;
    private spaceText: eui.Label;
    private costText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        var vo:any = CM.getCardVO(this.data.id);
        this.des.text = this.data.id
        if(this.data.id > 100)
        {
            this.spaceText.text = ''
        }
        else
        {
            this.spaceText.text = vo.space
        }

        this.costText.text = vo.cost;
        this.selectMC.visible = false;
    }

}