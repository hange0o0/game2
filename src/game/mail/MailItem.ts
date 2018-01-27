class MailItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MailItemSkin";
    }

    private nameText: eui.Label;
    private timeText: eui.Label;
    private type: eui.Image;
    private desText: eui.Label;
    private redMC: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}