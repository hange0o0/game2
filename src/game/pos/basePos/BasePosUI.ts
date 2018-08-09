class BasePosUI extends game.BaseUI {

    private static _instance: BasePosUI;
    public static getInstance(): BasePosUI {
        if(!this._instance)
            this._instance = new BasePosUI();
        return this._instance;
    }

    private scrollerBG: eui.Group;
    private titleGroup: eui.Group;
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
    private arrowGroup: eui.Group;
    private arrowMC: eui.Image;
    private changePosMC: eui.Image;
    private typeIcon: eui.Image;

    private infoGroup: eui.Group;
    private infoList: eui.List;
    private infoCloseBtn: eui.Image;
    private infoBtn: eui.Group;
    private renameBtn: eui.Group;
    private videoBtn: eui.Group;

    private listCon: eui.Group;
    private heroList: eui.List;








    public type = 'atk'
    public index = 0  //第X个阵
    public newName
    public useCard = {}
    public maxCard = 0;

    private posData //进入时的数据


    private dragTarget = new BasePosItem()

    private listData:eui.ArrayCollection
    private selectData;
    private selectIndex;

    private targetIndex;
    private insertPos = 0;

    //private swapData;
    public pkData;
    private sp;
    private arrowTW;
    private changeTW;
    private deleteBtnIndex;


    public constructor() {
        super();
        this.skinName = "BasePosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.onClose,this);

        this.dragTarget.alpha = 0.3;
        this.list.itemRenderer =  BasePosChooseItem;
        this.list.addEventListener('start_drag',this.onDragStart,this);
        this.list.addEventListener('end_drag',this.onDragEnd,this);
        this.list.addEventListener('move_drag',this.onDragMove,this);
        this.listData = new eui.ArrayCollection()
        this.list.dataProvider = this.listData

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);

        this.tabList.itemRenderer = BasePosTabItem
        this.tabList.dataProvider = new eui.ArrayCollection([0,1,2,3,4])

        this.infoList.itemRenderer = PosListHeadClickItem;

        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.testBtn,this.onTest)
        this.addBtnEvent(this.upBtn,this.onUp)
        this.addBtnEvent(this.downBtn,this.onDown)
        this.addBtnEvent(this.openBtn,this.onOpen)
        this.addBtnEvent(this.renameBtn,this.onRename)
        this.addBtnEvent(this.infoBtn,this.onInfo)
        this.addBtnEvent(this.infoCloseBtn,this.onInfoClose)
        this.addBtnEvent(this.videoBtn,this.onVideo)

        var tw = this.arrowTW = egret.Tween.get(this.arrowMC,{loop:true});
        tw.to({scaleX:1.1,scaleY:0.8},200).to({scaleX:1,scaleY:1.1,y:this.arrowMC.y -10},200).
            to({scaleX:1.1,scaleY:0.8,y:this.arrowMC.y},200).to({scaleX:1,scaleY:1},300).wait(200);
        this.arrowTW.setPaused(true)


        var tw = this.changeTW = egret.Tween.get(this.changePosMC,{loop:true});
        tw.to({rotation:30},100).to({rotation:-30},200).to({rotation:20},150).to({rotation:-20},150).to({rotation:0},70).wait(200);
        this.changeTW.setPaused(true)



        this.arrowGroup.touchChildren = this.arrowGroup.touchEnabled = false;
        this.arrowGroup.visible = false;
    }

    private onVideo(){
        PKHistoryUI.getInstance().show(this.pkData.history);
    }

    private onInfo(){
        this.infoGroup.visible = true;
        this.infoList.dataProvider = new eui.ArrayCollection(this.pkData.otherList.split(','))
        this.infoList.validateNow();
        this.infoGroup.bottom = -this.infoGroup.height;
        egret.Tween.get(this.infoGroup).to({bottom:0},200);
        this.videoBtn.visible = this.pkData.history && this.pkData.history.length > 0
    }
    private onInfoClose(){
        egret.Tween.get(this.infoGroup).to({bottom:-this.infoGroup.height},200).call(()=>{
            this.infoGroup.visible = false;
        });
    }

    private onRename(){
        PosNameUI.getInstance().show(this.posData && this.posData.name && Base64.decode(this.posData.name),(name)=>{
            if(!this.posData)
            {
                this.newName = name;
                this.renewTitle()
                return;
            }
             PosManager.getInstance().changeName(this.type,this.index,name,()=>{
                 //this.posData.name = Base64.encode(name);
                 this.renewTitle()
             });
        })
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
            if(this.type == 'atk')
                SharedObjectManager.getInstance().setMyValue('pk_choose',this.index)
            else
                SharedObjectManager.getInstance().setMyValue('pk_choose_def',this.index)
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
        this.testSave(()=>{
            if(this.type == 'atk')
                SharedObjectManager.getInstance().setMyValue('pk_choose',this.index)
            else
                SharedObjectManager.getInstance().setMyValue('pk_choose_def',this.index)
            PosTestUI.getInstance().show(this.type,{
                list:this.changeToServerList(),
                name:Base64.encode((this.type == 'atk'?'进攻':'防御') + this.index),
            })

            this.sp = {};
            this.renew();
        })

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
        if(this.testSave(()=>{
                this.sp.fun && this.sp.fun();
            }))
        {
            this.hide();
        }
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

        var posName = this.posData && this.posData.name && Base64.decode(this.posData.name) || this.newName
        if(this.pkData)
        {
            if(this.pkData.noTab)
                posName = '';
            this.topUI.setTitle((this.pkData.title || '战斗准备') + (posName?'【'+posName+'】':''),this.pkData.helpKey || (this.type == 'atk'?'atkPos':'defPos'))
        }
        else if(this.type == 'atk')
        {
            this.topUI.setTitle(posName ||  '进攻阵容','atkPos')
        }
        else
        {
            this.topUI.setTitle(posName || '防守阵容','defPos')
        }

        this.titleGroup.visible = !(this.pkData && this.pkData.stopAdd)
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
            PosManager.getInstance().addPos(this.type,this.index,serverList,this.newName,()=>{
                    fun && fun();
                    //MyWindow.ShowTips('保存成功！')
                    //this.posData = PosManager.getInstance().getListByType(this.type)[index]
                })
        }
        return true
    }

    private isStopDelete(){
        return  this.pkData && this.pkData.stopAdd
    }


    public onUnSelect(){

        var item = this.list.selectedItem;
        if(!item)
            return;
        if(item.setting)
        {
             BasePosChooseUI.getInstance().show(this.listData,this)
        }
        else if(!game.BaseUI.isStopEevent)
        {
            var stopDelete = this.isStopDelete();
            if(stopDelete)
                return
            var index = this.listData.getItemIndex(item);
            this.useCard[item.id] --;
            this.listData.removeItemAt(index)
            if(!this.listData.getItemAt(this.listData.length-1).setting)
            {
                //if(!stopDelete)
                    this.listData.addItem({setting:true})
            }

            if(this.listData.length <= 1)
                MyTool.removeMC(this.deleteBtn)
            this.renewTitle()
        }
    }

    private onDragStart(e){
        this.insertPos = 0;
        this.selectData = e.target.data;
        this.targetIndex = this.selectIndex = this.listData.source.indexOf(this.selectData);
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
        var orginIndex= Math.floor((p.x)/105) + Math.floor(p.y/130)*6;
        var index = Math.max(0,Math.min(maxIndex,orginIndex))
        //var isOver = p.x%105 >30 && p.x%105 <80;
        var lastInsetPos = this.insertPos;
        if(p.x%105 <= 30)
            this.insertPos = -1;
        else if(p.x%105 >= 80)
            this.insertPos = 1;
        else
            this.insertPos = 0;

        if(orginIndex > maxIndex) //越界了
        {
            this.insertPos = 0
            this.targetIndex = -1;
        }
        else if(index != this.targetIndex || lastInsetPos != this.insertPos)
        {
            this.targetIndex = index
        }




        egret.callLater(this.renewSelectItem,this);
        //this.once(egret.Event.ENTER_FRAME,this.renewSelectItem,this)
    }

    //private onDragMove(e){
    //    this.dragTarget.x = e.data.x - this.dragTarget.width/2;
    //    this.dragTarget.y = e.data.y - this.dragTarget.height/2;
    //
    //    var p = this.list.globalToLocal(e.data.x,e.data.y)
    //    p.x -= 8;
    //    p.y -= 10;
    //    //90*110
    //    //8/20
    //    var maxIndex = this.listData.length - 2;
    //    var index = Math.max(0,Math.min(maxIndex,Math.floor((p.x + 30)/105) + Math.floor(p.y/130)*6))
    //    var isOver = p.x%105 >30 && p.x%105 <80;
    //    console.log(index);
    //
    //
    //
    //    if(index != this.selectIndex || isOver != (!!this.swapData))
    //    {
    //        //console.log(isOver)
    //        if(this.swapData)//还原回去
    //        {
    //            var swapIndex = this.listData.getItemIndex(this.swapData)
    //            this.listData.removeItemAt(swapIndex)
    //            this.listData.addItemAt(this.swapData,this.selectIndex + 1)//插入到当前位置
    //        }
    //        this.listData.removeItemAt(this.selectIndex)//先把自己去掉
    //        this.selectIndex = index;
    //        this.listData.addItemAt(this.selectData,index)//插入到当前位置
    //        if(isOver)//交换
    //        {
    //            if(this.targetIndex != this.selectIndex)
    //            {
    //                var data = this.listData.removeItemAt(this.selectIndex+1)//把下家去掉
    //                if(this.targetIndex > this.selectIndex)
    //                    this.listData.addItemAt(data,this.targetIndex)//插入到以前位置
    //                else if(this.targetIndex < this.selectIndex)
    //                    this.listData.addItemAt(data,this.targetIndex+1)//插入到以前位置
    //                this.swapData = data
    //            }
    //            else //指回原来位置
    //            {
    //                this.swapData = null;
    //            }
    //        }
    //        else
    //        {
    //            this.swapData = null;
    //        }
    //    }
    //    egret.callLater(this.renewSelectItem,this);
    //    //this.once(egret.Event.ENTER_FRAME,this.renewSelectItem,this)
    //}


    //private onDragMove(e){
    //    this.dragTarget.x = e.data.x - this.dragTarget.width/2;
    //    this.dragTarget.y = e.data.y - this.dragTarget.height/2;
    //
    //    var p = this.list.globalToLocal(e.data.x,e.data.y)
    //    p.x -= 8;
    //    p.y -= 10;
    //    //90*110
    //    //8/20
    //    var maxIndex = this.listData.length - 2;
    //    var index = Math.max(0,Math.min(maxIndex,Math.floor(p.x/98) + Math.floor(p.y/130)*6))
    //    if(index != this.selectIndex)
    //    {
    //        this.listData.removeItemAt(this.selectIndex)
    //        this.selectIndex = index;
    //        this.listData.addItemAt(this.selectData,index)
    //        egret.callLater(this.renewSelectItem,this);
    //    }
    //}

    private onDragEnd(e){
        MyTool.removeMC(this.dragTarget)
        var index = Math.max(0,this.insertPos + this.targetIndex)
        if(this.targetIndex != -1 && this.selectIndex != index)
        {
            if(this.insertPos == 0)
            {
                var item = this.listData.replaceItemAt(this.selectData,index)
                this.listData.replaceItemAt(item,this.selectIndex)
            }
            else
            {
                this.listData.removeItemAt(this.selectIndex)
                if(index > this.selectIndex && this.insertPos > 0)
                    index --;
                this.listData.addItemAt(this.selectData,index)
            }
        }



        this.selectData = null
        this.selectIndex = -1
        this.targetIndex = -1
        this.insertPos = 0

        this.renewSelectItem();


    }

    private renewSelectItem(){
        var chooseData = this.listData.getItemAt(this.targetIndex);
        var swapData = this.selectData && this.targetIndex != this.selectIndex && this.insertPos==0?chooseData:null;
        var targetItem;
        for(var i=0;i<this.list.numChildren;i++)
        {
            var item:BasePosChooseItem = <BasePosChooseItem>this.list.getChildAt(i);
            item.renewSelect(this.selectData,swapData);
            if(item.data == chooseData)
                targetItem = item;
        }
        if(this.targetIndex == -1)
        {
            this.arrowTW.setPaused(true)
            this.changeTW.setPaused(true)
            this.arrowGroup.visible = false
        }
        else
        {

            this.arrowGroup.visible = true
            var p = targetItem.localToGlobal(0,0)
            this.arrowGroup.y = p.y - 5;
            if(this.insertPos == 0)
            {
                this.arrowGroup.x = p.x + targetItem.width/2
                this.changePosMC.visible = true
                this.arrowMC.visible = false
                this.changeTW.setPaused(false)
            }
            else
            {
                this.changePosMC.visible = false
                this.arrowMC.visible = true
                this.arrowTW.setPaused(false)
                if(this.insertPos == -1)
                    this.arrowGroup.x = p.x - 4
                else
                    this.arrowGroup.x = p.x + targetItem.width +  4
            }
        }
    }

    /*
    *  pkData:{
    *   list
    *   noTab
    *   fun
    *   hideFun
    *   title
    *   helpKey
    *   stopAdd
    *   stopRemoveTips
    *   stopTest
    *   history//可看的录像
    *   otherList//其它人的进功阵容
    *  }
    *  sp:{
    *  index,
    *  list
    *  }
    * */
    public show(type?,pkData?,sp?){
        this.type = type;
        this.pkData = pkData;
        this.sp = sp || {};
        this.index = type == 'atk'?(SharedObjectManager.getInstance().getMyValue('pk_choose') || 0):(SharedObjectManager.getInstance().getMyValue('pk_choose_def') || 0);
        if('index' in this.sp)
            this.index = this.sp.index;
        if(this.pkData && this.pkData.history)//移除过期的
        {
             for(var i=0;i<this.pkData.history.length;i++)
             {
                  if(this.pkData.history[i].version != Config.pk_version)
                  {
                      this.pkData.history.splice(i,1);
                      i--;
                  }
             }
        }
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.infoGroup.visible = false;
        this.openBtn.visible =  this.type == 'def';
        this.maxCard = PosManager.getInstance().maxPosNum();

        this.typeIcon.source = this.type == 'atk'?'icon_atk3_png':'icon_def1_png'
        this.currentState = 'normal'
        this.deleteBtnIndex = 1;
        this.btnGroup.addChildAt(this.renameBtn,0)
        if(this.pkData)
        {
            if(this.pkData.otherList)
            {
                this.deleteBtnIndex ++;
                this.btnGroup.addChildAt(this.infoBtn,0)
            }
            else
                MyTool.removeMC(this.infoBtn)
            if(this.pkData.stopTest)
                MyTool.removeMC(this.testBtn)
            else
                this.btnGroup.addChild(this.testBtn)
            this.btnGroup.addChild(this.pkBtn)
            if(this.pkData.noTab)
            {
                this.currentState = 'pk'
                this.deleteBtnIndex --;
                MyTool.removeMC(this.renameBtn)
            }
            if(this.pkData.isPVP)
                this.addPanelOpenEvent(GameEvent.client.PVP_END,this.hide)
        }
        else
        {
            this.btnGroup.addChild(this.testBtn)
            MyTool.removeMC(this.pkBtn)
            MyTool.removeMC(this.infoBtn)
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
        this.sp = {};
        this.testSave(()=>{
            this.index = index;
            this.renew();
            this.renewTabList();
        });
    }

    public resetData(){
        var stopDelete = this.isStopDelete()
        if(this.listData.length < this.maxCard && !stopDelete)
            this.listData.addItem({setting:true})
        this.renewBtn(true);
        this.renewTitle();

        if(this.listData.length > 1 && !stopDelete)
            this.btnGroup.addChildAt(this.deleteBtn,this.deleteBtnIndex)
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
        }
        else
        {
            this.list.y = 0;
        }
        this.scrollerBG.y = this.list.y
    }

    public renew(){
        var removeSkill = []
        var PM = PosManager.getInstance();
        var data = this.posData = PM.getListByType(this.type)[this.index]
        var stopDelete = this.isStopDelete()
        this.useCard = {};
        this.newName = null;
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
        if(data || this.sp.list)
        {
            var list
            if(this.sp.list)
                list = this.sp.list;
            else
                list = data.list.split(',')
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


            this.btnGroup.addChildAt(this.deleteBtn,this.deleteBtnIndex)
            if(this.type == 'def')
            {
                this.openBtn.visible = true;
                this.openBtn.selected = data && !data.close
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

        var stopRemoveTips = this.pkData && this.pkData.stopRemoveTips
        if(removeSkill.length > 0 && !stopRemoveTips)
            MyWindow.ShowTips('移除了 ' + removeSkill.length + ' 张无效法术牌')


    }
}