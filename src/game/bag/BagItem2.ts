class BagItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BagItem2Skin";
    }

    private mc: eui.Image;
    private nameText: eui.Label;
    private numText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}




