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
    private onOpen(e){
        e.stopImmediatePropagation();
        PosManager.getInstance().changeClose('def',this.data.id,()=>{
            this.dataChanged();
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

            this.disableMC.visible = this.data.close
            this.openBtn.selected = !this.data.close
            var str = this.data.list.replace(new RegExp("#","g"),",")
            var list = str.split(',');
            this.list.dataProvider = new eui.ArrayCollection(list)

            this.desText.text = Base64.decode(this.data.name) + '  ('+list.length+'/'+PosManager.getInstance().maxPosNum()+')';
        }
    }

}