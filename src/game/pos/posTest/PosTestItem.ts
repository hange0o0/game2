class PosTestItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosTestItemSkin";
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
        //
        PosTestUI.getInstance().test(this.data.data)
        PosTestUI.getInstance().hide();
    }

    public dataChanged(){
        var data = this.data.data;
        //var str = data.list
        var str = data.list//.replace(new RegExp("#","g"),",")
        var list = str.split(',');

        this.dataArray.source = list;
        this.dataArray.refresh()

        this.desText.text = Base64.decode(data.name) + '  ('+list.length+'/'+PosManager.getInstance().maxPosNum()+')';
    }

}