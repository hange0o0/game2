class AtkPosListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AtkPosListItemSkin";
    }

    private desText: eui.Label;
    private list: eui.List;

    private dataArray = new eui.ArrayCollection()

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PosListHeadItem
        this.list.dataProvider = this.dataArray
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        BasePosUI.getInstance().show('atk',this.data.index);
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

            this.dataArray.source = list;
            this.dataArray.refresh()

            this.desText.text = Base64.decode(this.data.name) + '  ('+list.length+'/'+PosManager.getInstance().maxPosNum()+')';
        }
    }

}