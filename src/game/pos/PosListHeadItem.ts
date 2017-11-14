class PosListHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosListHeadItemSkin";
    }

    private desText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}