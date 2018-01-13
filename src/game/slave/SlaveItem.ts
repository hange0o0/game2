class SlaveItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveItemSkin";
    }

    private lockText: eui.Label;
    private nameText: eui.Label;
    private coinText: eui.Label;
    private type: eui.Image;
    private getBtn: eui.Button;
    private cdText: eui.Label;



    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}