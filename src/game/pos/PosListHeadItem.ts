class PosListHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosListHeadItemSkin";
    }

    private bg: eui.Image;
    private img: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}