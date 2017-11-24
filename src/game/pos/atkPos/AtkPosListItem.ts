class AtkPosListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AtkPosListItemSkin";
    }

    private desText: eui.Label;
    private list: eui.List;


    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PosListHeadItem
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        AtkPosUI.getInstance().show(this.data.index);
    }

    public dataChanged(){
        if(this.data.empty)
        {
            this.currentState = 'empty'
        }
        else
        {
            this.currentState = 'normal'
            this.desText.text = this.data.name;
            this.list.dataProvider = new eui.ArrayCollection([])
        }
    }

}