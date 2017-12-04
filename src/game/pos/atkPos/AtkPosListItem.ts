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
            this.currentState = 'add'
        }
        else
        {
            this.currentState = 'normal'
            var str = this.data.list
            var list = str.split(',');
            this.list.dataProvider = new eui.ArrayCollection(list)

            this.desText.text = Base64.decode(this.data.name) + '  ('+list.length+'/'+PosManager.getInstance().maxPosNum()+')';
        }
    }

}