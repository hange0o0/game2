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
        this.list.itemRenderer = PosListHeadItem
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.openBtn,this.onOpen)
    }

    private onClick(){
        DefPosUI.getInstance().show(this.data.index);
    }
    private onOpen(){

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