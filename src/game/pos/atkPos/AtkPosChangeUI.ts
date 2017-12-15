class AtkPosChangeUI extends game.BaseUI {
    private static _instance: AtkPosChangeUI;
    public static getInstance(): AtkPosChangeUI {
        if(!this._instance)
            this._instance = new AtkPosChangeUI();
        return this._instance;
    }

    private topUI: TopUI;
    private scrollerBG: eui.Rect;
    private bottomUI: BottomUI;
    private deleteBtn: eui.Label;
    private list: eui.List;




    private dragTarget = new AtkPosItem()

    private listData:eui.ArrayCollection
    private selectData;
    private selectIndex;
    private callDelete = false;
    private everDelete = false;
    public constructor() {
        super();
        this.skinName = "AtkPosChangeUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('调整卡组顺序');

        this.dragTarget.alpha = 0.3;
        this.list.itemRenderer =  AtkPosChangeItem;
        this.list.addEventListener('start_drag',this.onDragStart,this);
        this.list.addEventListener('end_drag',this.onDragEnd,this);
        this.list.addEventListener('move_drag',this.onDragMove,this);
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

        if(this.deleteBtn.hitTestPoint(e.data.x,e.data.y))
        {
            this.deleteBtn.stroke = 2
            this.callDelete = true;
            return;
        }

        this.callDelete = false;
        this.deleteBtn.stroke = 0
        var p = this.list.globalToLocal(e.data.x,e.data.y)
        p.x -= 8;
        p.y -= 10;
        //90*110
        //8/20
        var maxIndex = this.listData.length - 1;
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
        if(this.callDelete)
        {
            this.everDelete = true;
            AtkPosUI.getInstance().deleteID(this.selectData.id)
            this.listData.removeItemAt(this.selectIndex)
            this.deleteBtn.stroke = 0
        }
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
        super.show()
    }

    public hide() {
        MyTool.clearList(this.list);
        if(this.everDelete)
            AtkPosUI.getInstance().justRenewList2()
        AtkPosUI.getInstance().addSetting()
        super.hide();
    }

    public onShow(){
        if(GameManager.stage.stageHeight < 1050 && this.topUI.parent)
        {
            MyTool.removeMC(this.topUI)
            this.scrollerBG.y = 0;
            this.list.top = 0;
        }
        this.callDelete = false
        this.everDelete = false
        this.list.dataProvider = this.listData
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){

    }
}