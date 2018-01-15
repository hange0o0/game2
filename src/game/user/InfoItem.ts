class InfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "InfoItemSkin";
    }

    private nameText: eui.Label;
    private type: eui.Image;
    private coinText: eui.Label;
    private forceText: eui.Label;



    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}