class TecItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecItemSkin";
    }

    private mc: eui.Image;
    private nameText: eui.Label;
    private desText: eui.Label;
    private upBtn: eui.Button;
    private coinText: eui.Label;
    private propGroup1: eui.Group;
    private propText1: eui.Label;
    private propMC1: eui.Image;
    private propGroup2: eui.Group;
    private propText2: eui.Label;
    private propMC2: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}