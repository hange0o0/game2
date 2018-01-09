class BasePosUI extends game.BaseUI {


    private scrollerBG: eui.Group;
    private topUI: TopUI;
    private list: eui.List;
    private bottomUI: BottomUI;
    private btnGroup: eui.Group;
    private deleteBtn: eui.Group;
    private renameBtn: eui.Group;
    private testBtn: eui.Group;
    private saveBtn: eui.Group;
    private downBtn: eui.Image;
    private upBtn: eui.Image;


    public type = 'atk'
    public callDelete;
    private index = 0  //第X个阵
    public useCard = {}
    public maxCard = 0;

    private posName = ''
    private posData


    private dragTarget = new BasePosItem()

    private listData:eui.ArrayCollection
    private selectData;
    private selectIndex;
    //private callDelete = false;
    //private everDelete = false;

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

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);

        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.renameBtn,this.onRename)
        this.addBtnEvent(this.saveBtn,this.onSave)
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
        if(this.callDelete && !this.posData && this.listData.length <= 1)
        {
            PosManager.getInstance().deletePos(this.type,this.callDelete.id,()=>{
                this.hide()
            })
            return;
        }
        var b = !this.posData && this.listData.length > 1
        if(!b)
            b = this.posData && (Base64.decode(this.posData.name) != this.posName || this.posData.list != this.changeToServerList())
        if(b)
        {
            Confirm('还没保存，确定退出吗？',(b)=>{
                if(b==2)
                {
                    this.hide();
                }
                else if(b==1)
                {
                    if(this.onSave())
                        this.hide();
                }
            },['直接退出','保存并退出']).closeBtn.visible = true
            return;
        }

        this.hide();
    }


    private onDelete(){
        Confirm('确定要删除该阵法吗？',(b)=>{
            if(b==1)
            {
                this.callDelete = this.posData;
                var name = this.posName;
                this.renew(true);
                this.posName = name;
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
        var title = this.type == 'atk'?'【进攻阵容】':'【防御阵容】'
        this.topUI.setTitle(title + '- ' + this.posName + ' ('+this.listData.length+'/'+this.maxCard+')')
    }

    private onSave(){
        if(this.listData.length == 0)
        {
            Alert('必须上阵最少一张卡牌')
            return false
        }
        var serverList = this.changeToServerList();
        if(this.callDelete)
        {
            this.posData = this.callDelete;
        }
        if(this.posData)
        {
            PosManager.getInstance().changePos(this.type,this.posData.id,
                this.posName,serverList,()=>{
                    ShowTips('保存成功！')
                    this.callDelete = null
                })
        }
        else
        {
            PosManager.getInstance().addPos(this.type,
                this.posName,serverList,()=>{
                    ShowTips('保存成功！')
                    this.callDelete = null
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
            this.listData.removeItemAt(index)
            if(!this.listData.getItemAt(this.listData.length-1).setting)
                this.listData.addItem({setting:true})

            if(this.listData.length <= 1)
                MyTool.removeMC(this.deleteBtn)
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

    public show(v?){
        this.index = v;
        this.callDelete = null;
        super.show()
    }

    public hide() {
        MyTool.clearList(this.list);
        super.hide();
    }

    public onShow(){
        this.callDelete = false
        this.maxCard = PosManager.getInstance().maxPosNum();
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
        this.listData = new eui.ArrayCollection(arr)
        this.list.dataProvider = this.listData
        this.renewTitle();
        this.renewBtn();
    }
}