class HangItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HangItemSkin";
    }

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