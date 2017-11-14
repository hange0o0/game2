class DefPosListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosListItemSkin";
    }

    private desText: eui.Label;
    private list: eui.List;
    private openBtn: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}