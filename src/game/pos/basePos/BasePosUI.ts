class BasePosUI extends game.BaseUI {

    private static _instance: BasePosUI;
    public static getInstance(): BasePosUI {
        if(!this._instance)
            this._instance = new BasePosUI();
        return this._instance;
    }

    private scrollerBG: eui.Group;
    private topUI: TopUI;
    private list: eui.List;
    private bottomUI: BottomUI;
    private btnGroup: eui.Group;
    private deleteBtn: eui.Group;
    private renameBtn: eui.Group;
    private testBtn: eui.Group;
    private downBtn: eui.Image;
    private upBtn: eui.Image;
    private titleText: eui.Label;



    public type = 'atk'
    private index = 0  //第X个阵
    public useCard = {}
    public maxCard = 0;

    private posName = ''
    private posData //进入时的数据


    private dragTarget = new BasePosItem()

    private listData:eui.ArrayCollection
    private selectData;
    private selectIndex;

    public constructor() {
        super();
        this.skinName = "BasePosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.onClose,this);
        this.topUI.setTitle('调整卡组顺序');

        this.dragTarget.alpha = 0.3;
        this.list.itemRenderer =  BasePosChangeItem;
        this.list.addEventListener('start_drag',this.onDragStart,this);
        this.list.addEventListener('end_drag',this.onDragEnd,this);
        this.list.addEventListener('move_drag',this.onDragMove,this);
        this.listData = new eui.ArrayCollection()
        this.list.dataProvider = this.listData

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);

        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.renameBtn,this.onRename)
        this.addBtnEvent(this.testBtn,this.onTest)
        this.addBtnEvent(this.upBtn,this.onUp)
        this.addBtnEvent(this.downBtn,this.onDown)
    }
    
    private onUp(){
        this.renewBtn(false)
    }
    private onDown(){
        this.renewBtn(true)
    }

    private onTest(){
        PosTestUI.getInstance().show(this.type,{
            list:this.changeToServerList(),
            name:Base64.encode(this.posName),
        })
    }


    public changeToServerList(){
        var arr = [];
        for(var i=0;i<this.listData.length-1;i++)
        {
            arr.push(this.listData.getItemAt(i).id)
        }
        return arr.join(',');
    }

    public onClose(){
        var PM = PosManager.getInstance();
        if(this.listData.length <= 1)
        {
            if(this.type == 'def' && this.posData && !this.posData.close && PM.getOpenDef().length <= 1)
            {
                MyWindow.Alert('必须上阵最少一张卡牌');
                return;
            }
        }

        var b = !this.posData && this.listData.length > 1
        if(!b)
            b = this.posData && (Base64.decode(this.posData.name) != this.posName || this.posData.list != this.changeToServerList())
        if(b) //有变化
        {
            this.onSave()
        }

        this.hide();
    }


    private onDelete(){
        MyWindow.Confirm('确定要删除该阵法吗？',(b)=>{
            if(b==1)
            {
                var arr = [{setting:true}];
                MyTool.removeMC(this.deleteBtn)
                this.listData.source = arr;
                this.listData.refresh()
                this.renewTitle();
                this.renewBtn();
            }
        })
    }

    private onRename(){
        PosNameUI.getInstance().show(this.posName)
        PosNameUI.getInstance().once('nameChange',this.onNameChange,this)
    }

    private onNameChange(e){
        this.posName = e.data
        this.renewTitle();
    }

    private renewTitle(){
        var length = this.listData.length
        if(this.listData.getItemAt(this.listData.length-1).setting)
            length --;
        this.topUI.setTitle(this.posName + ' ('+length+'/'+this.maxCard+')')
    }

    private onSave(){
        if(this.listData.length <= 1 && this.posData)
        {
            PosManager.getInstance().deletePos(this.type,this.posData.id,()=>{
            })
            return false;
        }
        var serverList = this.changeToServerList();
        if(this.posData)
        {
            PosManager.getInstance().changePos(this.type,this.posData.id,
                this.posName,serverList,()=>{
                    //MyWindow.ShowTips('保存成功！')
                })
        }
        else
        {
            PosManager.getInstance().addPos(this.type,
                this.posName,serverList,()=>{
                    //MyWindow.ShowTips('保存成功！')
                    this.posData = PosManager.getInstance().getListByType(this.type)[this.index]
                })
        }
        return true
    }


    public onUnSelect(){
        var item = this.list.selectedItem;
        if(item.setting)
        {
             BasePosChooseUI.getInstance().show(this.listData,this)
        }
        else if(!game.BaseUI.isStopEevent)
        {
            var index = this.listData.getItemIndex(item);
            this.useCard[item.id] --;
            this.listData.removeItemAt(index)
            if(!this.listData.getItemAt(this.listData.length-1).setting)
                this.listData.addItem({setting:true})

            if(this.listData.length <= 1)
                MyTool.removeMC(this.deleteBtn)
            this.renewTitle()
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

    public show(type?,index?){
        this.type = type;
        this.index = index;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.maxCard = PosManager.getInstance().maxPosNum();
        this.titleText.text = this.type == 'atk'?'【进攻阵容】':'【防御阵容】'
        this.renew();
    }

    public resetData(){
        if(this.listData.length < this.maxCard)
            this.listData.addItem({setting:true})
        this.renewBtn(true);
        this.renewTitle();
        if(this.listData.length > 1)
            this.btnGroup.addChildAt(this.deleteBtn,0)
    }

    public renewBtn(toBottom?){
        this.upBtn.visible = false
        this.downBtn.visible = false
        var listHeight = Math.ceil(this.listData.length/4)*130
        var scrollHeight = GameManager.stage.stageHeight-60-100
        if( listHeight > scrollHeight)
        {
            if(toBottom)
            {
                this.upBtn.visible = true
                this.list.y = 60 + scrollHeight - listHeight

            }
            else
            {
                this.downBtn.visible = true
                this.list.y = 60
            }
            this.scrollerBG.y = this.list.y
        }
    }

    public renew(noPosData?){
        var PM = PosManager.getInstance();
        var data = this.posData = noPosData?null:PM.getListByType(this.type)[this.index]
        this.useCard = {};
        var arr = [];
        if(data)
        {
            this.posName = Base64.decode(data.name) || '未命名';

            var list = data.list.split(',')
            for(var i=0;i<list.length;i++)
            {
                var id = list[i];
                this.useCard[id] = (this.useCard[id] || 0) + 1;
                arr.push({id:id})
            }

            this.btnGroup.addChildAt(this.deleteBtn,0)
        }
        else
        {
            this.posName = '新建阵容' + this.index;
            MyTool.removeMC(this.deleteBtn)
        }
        if(arr.length < this.maxCard)
            arr.push({setting:true})
        this.listData.source = arr;
        this.listData.refresh()
        this.renewTitle();
        this.renewBtn();
    }
}