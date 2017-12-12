class PKCardInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKCardInfoItemSkin";
    }

    private icon: eui.Image;
    private text: eui.Label;





    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}