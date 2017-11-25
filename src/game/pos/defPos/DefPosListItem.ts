class DefPosListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosListItemSkin";
    }

    private disableMC: eui.Image;
    private desText: eui.Label;
    private list: eui.List;
    private openBtn: eui.CheckBox;



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
        this.data.close = !this.data.close
        this.dataChanged();
    }

    public dataChanged(){
        if(this.data.empty)
        {
            this.currentState = 'add'
        }
        else
        {
            this.currentState = 'normal'
            this.desText.text = this.data.name;
            this.disableMC.visible = this.data.close
            this.openBtn.selected = !this.data.close
            this.list.dataProvider = new eui.ArrayCollection(this.data.list)
        }
    }

}