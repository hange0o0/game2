class DefPosChangeUI extends game.BaseUI {
    private static _instance: DefPosChangeUI;
    public static getInstance(): DefPosChangeUI {
        if(!this._instance)
            this._instance = new DefPosChangeUI();
        return this._instance;
    }

    private topUI: TopUI;
    private scrollerBG: eui.Rect;
    //private bottomUI: BottomUI;
    //private deleteBtn: eui.Label;
    private list: eui.List;




    private dragTarget = new DefPosItem()

    private listData:eui.ArrayCollection
    private selectData;
    private selectIndex;
    //private callDelete = false;
    private everDelete = false;
    public constructor() {
        super();
        this.skinName = "DefPosChangeUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        //this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('调整卡组顺序');

        this.dragTarget.alpha = 0.3;
        this.list.itemRenderer =  DefPosChangeItem;
        this.list.addEventListener('start_drag',this.onDragStart,this);
        this.list.addEventListener('end_drag',this.onDragEnd,this);
        this.list.addEventListener('move_drag',this.onDragMove,this);

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);
    }

    public onUnSelect(){
        var item = this.list.selectedItem;
        if(item.back)
        {
            this.hide();
        }
        else if(!game.BaseUI.isStopEevent)
        {
            this.everDelete = true;
            DefPosUI.getInstance().deleteID(item.id)
            var index = this.listData.getItemIndex(item);
            this.listData.removeItemAt(index)
        }
    }

    private onDragStart(e){
        this.selectData = e.target.data;
        this.selectIndex = this.listData.source.indexOf(this.selectData);
        this.dragTarget.data = e.target.data
        this.stage.addChild(this.dragTarget);
        this.dragTarget.x = e.data.x;
        this.dragTarget.y = e.data.y;

        this.renewSelectItem();
    }
    private onDragMove(e){
        this.dragTarget.x = e.data.x - this.dragTarget.width/2;
        this.dragTarget.y = e.data.y - this.dragTarget.height/2;

        //if(this.deleteBtn.hitTestPoint(e.data.x,e.data.y))
        //{
        //    this.deleteBtn.stroke = 2
        //    this.callDelete = true;
        //    return;
        //}

        //this.callDelete = false;
        //this.deleteBtn.stroke = 0
        var p = this.list.globalToLocal(e.data.x,e.data.y)
        p.x -= 8;
        p.y -= 10;
        //90*110
        //8/20
        var maxIndex = this.listData.length - 2;
        var index = Math.max(0,Math.min(maxIndex,Math.floor(p.x/98) + Math.floor(p.y/130)*6))
        if(index != this.selectIndex)
        {
            this.listData.removeItemAt(this.selectIndex)
            this.selectIndex = index;
            this.listData.addItemAt(this.selectData,index)
            this.once(egret.Event.ENTER_FRAME,this.renewSelectItem,this)
        }
    }

    private onDragEnd(e){
        MyTool.removeMC(this.dragTarget)
        //if(this.callDelete)
        //{
        //    this.everDelete = true;
        //    AtkPosUI.getInstance().deleteID(this.selectData.id)
        //    this.listData.removeItemAt(this.selectIndex)
        //    //this.deleteBtn.stroke = 0
        //}
        this.selectData = null
        this.selectIndex = -1
        this.renewSelectItem();
    }

    private renewSelectItem(){
        for(var i=0;i<this.list.numChildren;i++)
        {
            this.list.getChildAt(i)['renewSelect'](this.selectData);
        }
    }

    public show(v?){
        this.listData = v;
        this.listData.addItem({back:true})
        super.show()
    }

    public hide() {
        MyTool.clearList(this.list);
        if(this.everDelete)
            DefPosUI.getInstance().justRenewList2()
        this.listData.removeItemAt(this.listData.length - 1)
        DefPosUI.getInstance().addSetting()
        super.hide();
    }

    public onShow(){
        //if(GameManager.stage.stageHeight < 1050 && this.topUI.parent)
        //{
        //    MyTool.removeMC(this.topUI)
        //    this.scrollerBG.y = 0;
        //    this.list.top = 0;
        //}
        //this.callDelete = false
        this.everDelete = false
        this.list.dataProvider = this.listData
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){

    }
}