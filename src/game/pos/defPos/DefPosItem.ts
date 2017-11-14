class DefPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosItemSkin";
    }

    private cdText: eui.Label;
    private deleteBtn: eui.Label;
    private splitBtn: eui.Label;
    private mergeBtn1: eui.Rect;
    private mergeBtn2: eui.Rect;

    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}