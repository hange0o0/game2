class AtkPosListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AtkPosListItemSkin";
    }

    private desText: eui.Label;
    private list: eui.List;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}