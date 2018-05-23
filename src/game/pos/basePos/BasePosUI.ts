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
    private testBtn: eui.Group;
    public pkBtn: eui.Group;
    private downBtn: eui.Image;
    private upBtn: eui.Image;
    private titleText: eui.Label;
    private tabList: eui.List;
    private openBtn: eui.CheckBox;




    public type = 'atk'
    public index = 0  //第X个阵
    public useCard = {}
    public maxCard = 0;

    private posData //进入时的数据


    private dragTarget = new BasePosItem()

    private listData:eui.ArrayCollection
    private selectData;
    private selectIndex;
    private pkData;

    public constructor() {
        super();
        this.skinName = "BasePosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.onClose,this);

        this.dragTarget.alpha = 0.3;
        this.list.itemRenderer =  BasePosChangeItem;
        this.list.addEventListener('start_drag',this.onDragStart,this);
        this.list.addEventListener('end_drag',this.onDragEnd,this);
        this.list.addEventListener('move_drag',this.onDragMove,this);
        this.listData = new eui.ArrayCollection()
        this.list.dataProvider = this.listData

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);

        this.tabList.itemRenderer = BasePosTabItem
        this.tabList.dataProvider = new eui.ArrayCollection([0,1,2,3,4])

        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.testBtn,this.onTest)
        this.addBtnEvent(this.upBtn,this.onUp)
        this.addBtnEvent(this.downBtn,this.onDown)
        this.addBtnEvent(this.openBtn,this.onOpen)
    }

    private onOpen(e){
        e.stopImmediatePropagation();
        if(!this.posData.close && PosManager.getInstance().getOpenDef().length <= 1)
        {
            MyWindow.ShowTips('最少要有一个使用中的防御阵')
            this.openBtn.selected = true;
            return;
        }
        PosManager.getInstance().changeClose('def',this.index,()=>{
            //this.dataChanged();
            //this.bg2.source = this.data.close?'bg5_png':'bg2_png'
        })
    }

    private onPK(){
        if(this.listData.length <= 1)
        {
            MyWindow.Alert('还没设置出战卡组')
            return
        }
        this.testSave(()=>{
            if(this.pkData && this.pkData.list)
            {
                this.pkData.fun(this.changeToServerList())
                return;
            }
            SharedObjectManager.getInstance().setMyValue('pk_choose',this.index)
            this.pkData.fun(this.index)
        })
    }
    
    private onUp(){
        this.renewBtn(false)
    }
    private onDown(){
        this.renewBtn(true)
    }

    private onTest(){
        if(this.testSave())
        {
            if(this.type == 'atk')
                SharedObjectManager.getInstance().setMyValue('pk_choose',this.index)
            PosTestUI.getInstance().show(this.type,{
                list:this.changeToServerList(),
                name:Base64.encode((this.type == 'atk'?'进攻':'防御') + this.index),
            })
        }

    }


    public changeToServerList(){
        var arr = [];
        for(var i=0;i<this.listData.length;i++)
        {
            var item = this.listData.getItemAt(i);
            if(!item.setting)
                arr.push(item.id)
        }
        return arr.join(',');
    }

    public onClose(){
        if(this.pkData && this.pkData.list)
        {
            this.hide();
            this.pkData.hideFun && this.pkData.hideFun(this.changeToServerList());
            return;
        }
        if(this.testSave())
            this.hide();
    }

    private testSave(fun?){
        var PM = PosManager.getInstance();
        if(this.listData.length <= 1)
        {
            if(this.type == 'def' && this.posData && !this.posData.close && PM.getOpenDef().length <= 1)
            {
                MyWindow.Alert('必须上阵最少一张卡牌');
                return false;
            }
        }

        var b = !this.posData && this.listData.length > 1
        if(!b)
            b = this.posData && this.posData.list != this.changeToServerList()
        if(b) //有变化
        {
            this.onSave(fun)
        }
        else
        {
            fun && fun();
        }
        return true;
    }


    private onDelete(){
        MyWindow.Confirm('确定要删除该阵法吗？',(b)=>{
            if(b==1)
            {
                var arr = [{setting:true}];
                this.useCard = {};
                MyTool.removeMC(this.deleteBtn)
                this.listData.source = arr;
                this.listData.refresh()
                this.renewTitle();
                this.renewBtn();
            }
        })
    }

    private renewTitle(){
        var length = this.listData.length
        if(this.listData.getItemAt(this.listData.length-1).setting)
            length --;
        this.titleText.text = ''+length+' / '+this.maxCard
    }

    private onSave(fun?){
        if(this.pkData && this.pkData.list)
        {
            fun && fun();
            return true
        }

        var index = this.index;
        if(this.listData.length <= 1 && this.posData)
        {
            PosManager.getInstance().deletePos(this.type,this.posData.id,()=>{
                fun && fun();
            })
            return false;
        }
        var serverList = this.changeToServerList();
        if(this.posData)
        {
            PosManager.getInstance().changePos(this.type,this.index,serverList,()=>{
                    fun && fun();
                    //MyWindow.ShowTips('保存成功！')
                })
        }
        else
        {
            PosManager.getInstance().addPos(this.type,this.index,serverList,()=>{
                    fun && fun();
                    //MyWindow.ShowTips('保存成功！')
                    //this.posData = PosManager.getInstance().getListByType(this.type)[index]
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
            {
                var stopDelete = this.pkData && this.pkData.stopAdd
                if(!stopDelete)
                    this.listData.addItem({setting:true})
            }

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

    /*
    *  {
    *   list
    *   noTab
    *   fun
    *   hideFun
    *   title
    *   helpKey
    *   stopAdd
    *  }
    * */
    public show(type?,pkData?){
        this.type = type;
        this.pkData = pkData;
        this.index = type == 'atk'?(SharedObjectManager.getInstance().getMyValue('pk_choose') || 0):0;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.openBtn.visible =  this.type == 'def';
        this.maxCard = PosManager.getInstance().maxPosNum();
        if(this.pkData)
            this.topUI.setTitle(this.pkData.title || '战斗准备',this.pkData.helpKey || 'atkPos')
        else if(this.type == 'atk')
            this.topUI.setTitle('进攻阵容','atkPos')
        else
            this.topUI.setTitle('防守阵容','defPos')

        this.currentState = 'normal'
        if(this.pkData)
        {
            this.btnGroup.addChild(this.pkBtn)
            MyTool.removeMC(this.testBtn)
            if(this.pkData.noTab)
                this.currentState = 'pk'
        }
        else
        {
            this.btnGroup.addChild(this.testBtn)
            MyTool.removeMC(this.pkBtn)
        }

        this.renew();
        this.renewTabList();
        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().showGuide()
        }
    }

    private renewTabList(){
        MyTool.renewList(this.tabList)
    }

    public setTabSelect(index){
        if(this.index == index)
            return;

        this.testSave(()=>{
            this.index = index;
            this.renew();
            this.renewTabList();
        });
    }

    public resetData(){
        var stopDelete = this.pkData && this.pkData.stopAdd
        if(this.listData.length < this.maxCard && !stopDelete)
            this.listData.addItem({setting:true})
        this.renewBtn(true);
        this.renewTitle();

        if(this.listData.length > 1 && !stopDelete)
            this.btnGroup.addChildAt(this.deleteBtn,0)
    }

    public renewBtn(toBottom?){
        this.upBtn.visible = false
        this.downBtn.visible = false
        var listHeight = Math.ceil(this.listData.length/6)*130
        if(this.pkData && this.pkData.noTab)
            var scrollHeight = GameManager.stage.stageHeight-60-100
        else
            var scrollHeight = GameManager.stage.stageHeight-120-100
        if( listHeight > scrollHeight)
        {
            if(toBottom)
            {
                this.upBtn.visible = true
                this.list.y = scrollHeight - listHeight

            }
            else
            {
                this.downBtn.visible = true
                this.list.y = 0
            }
            this.scrollerBG.y = this.list.y
        }
    }

    public renew(){
        var removeSkill = []
        var PM = PosManager.getInstance();
        var data = this.posData = PM.getListByType(this.type)[this.index]
        var stopDelete = this.pkData && this.pkData.stopAdd
        this.useCard = {};
        if(GuideManager.getInstance().isGuiding)
        {
            data = {
                list:PKManager.getInstance().defaultCardList
            }
        }
        else if(this.pkData && this.pkData.list)
        {
            data = {
                list:this.pkData.list
            }
        }
        var arr = [];
        if(data)
        {
            var list = data.list.split(',')
            for(var i=0;i<list.length;i++)
            {
                var id = list[i];
                if(!stopDelete && id>PKConfig.skillBeginID)
                {
                    var num =CardManager.getInstance().getSkillNum(id);
                    var useNum = this.useCard[id] || 0
                    if(num<=useNum)
                    {
                        removeSkill.push('【'+CM.getCardVO(id).name + '】');
                        continue;
                    }
                }
                this.useCard[id] = (this.useCard[id] || 0) + 1;
                arr.push({id:id})
            }

            this.btnGroup.addChildAt(this.deleteBtn,0)
            if(this.type == 'def')
            {
                this.openBtn.visible = true;
                this.openBtn.selected = !data.close
            }
            else
            {
                this.openBtn.visible = false;
            }
        }
        else
        {
            MyTool.removeMC(this.deleteBtn)
            this.openBtn.visible = false;
        }


        if(stopDelete)
            MyTool.removeMC(this.deleteBtn)
        else if(arr.length < this.maxCard)
            arr.push({setting:true})
        this.listData.source = arr;
        this.listData.refresh()
        this.renewTitle();
        this.renewBtn();

        if(removeSkill.length > 0)
            MyWindow.ShowTips('移除了 ' + removeSkill.length + ' 张无效法术牌')


    }
}