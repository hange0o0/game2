class SlaveMasterItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveMasterItemSkin";
    }

    private forceText: eui.Label;
    private type: eui.Image;
    private nameText: eui.Label;
    private pkBtn: eui.Button;
    private clickArea: eui.Group;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.clickArea,this.onClick)
    }

    private onPK(){

    }

    private onClick(){

    }

    public dataChanged(){

    }

}