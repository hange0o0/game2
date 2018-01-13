class DefPosListItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosListItemSkin";
    }

    private bg2: eui.Image;
    private list: eui.List;
    private desText: eui.Label;
    private openBtn: eui.CheckBox;


   private dataArray = new eui.ArrayCollection()

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PosListHeadItem
        this.list.dataProvider = this.dataArray
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.openBtn,this.onOpen)
    }

    private onClick(){
        BasePosUI.getInstance().show('def',this.data.index);
    }
    private onOpen(e){
        e.stopImmediatePropagation();
        PosManager.getInstance().changeClose('def',this.data.id,()=>{
            //this.dataChanged();
            this.bg2.source = this.data.close?'bg5_png':'bg2_png'
        })
    }

    public dataChanged(){
        if(this.data.empty)
        {
            this.currentState = 'add'
        }
        else
        {
            this.currentState = 'normal'

            this.openBtn.selected = !this.data.close
            var str = this.data.list//.replace(new RegExp("#","g"),",")
            var list = str.split(',');
            this.bg2.source = this.data.close?'bg5_png':'bg2_png'

            //if(this.data.close)
            //{
            //    for(var i=0;i<list.length;i++)
            //    {
            //        list[i] = '@' + list[i]
            //    }
            //}
            this.dataArray.source = list;
            this.dataArray.refresh()

            this.desText.text = Base64.decode(this.data.name) + '  ('+list.length+'/'+PosManager.getInstance().maxPosNum()+')';
        }
    }

}