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
    private chooseCardBtn: eui.Group;
    private addCardBtn: eui.Group;

    private listCon: eui.Group;
    private heroList: eui.List;








    public type = 'atk'
    public index = 0  //第X个阵
    public newName
    public useCard = {}
    public maxCard = 0;

    private posData //进入时的数据


    private dragTarget = new BasePosItem()
    private dragTarget2 = new BasePosHeroItem()

    private listData:eui.ArrayCollection
    private heroListData:eui.ArrayCollection
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

    public cardBaseInfo


    public constructor() {
        super();
        this.skinName = "BasePosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.onClose,this);

        this.dragTarget.alpha = 0.3;
        this.dragTarget2.alpha = 0.3;
        this.list.itemRenderer =  BasePosChooseItem;
        this.heroList.itemRenderer =  BasePosHeroItem;
        this.list.addEventListener('start_drag',this.onDragStart,this);
        this.list.addEventListener('end_drag',this.onDragEnd,this);
        this.list.addEventListener('move_drag',this.onDragMove,this);
        this.heroList.addEventListener('start_drag',this.onDragStart2,this);
        this.heroList.addEventListener('end_drag',this.onDragEnd2,this);
        this.heroList.addEventListener('move_drag',this.onDragMove2,this);
        this.listData = new eui.ArrayCollection()
        this.heroListData = new eui.ArrayCollection()
        this.list.dataProvider = this.listData
        this.heroList.dataProvider = this.heroListData

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);
        this.heroList.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onHeroSelect,this);

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
        this.addBtnEvent(this.chooseCardBtn,this.onChooseCard)
        this.addBtnEvent(this.addCardBtn,this.onAddCard)
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

    private onChooseCard(){
        PKChooseCardUI.getInstance().show();
    }
    private onAddCard(){
        var FM = FightManager.getInstance();
        if(FM.award)
        {
            FightAwardUI.getInstance().show();
            return;
        }
        if(this.listData.length >= this.maxCard)
        {
            MyWindow.Alert('当前阵容卡牌数量已达上限')
            return;
        }
        var diamond = PKActiveManager.getInstance().base[1].diamond;
        MyWindow.Confirm('确定花费'+diamond+'增加卡牌？',(b)=>{
            if(b==1)
            {
                if(UM.testDiamond(diamond))
                {
                    FM.addChance(()=>{
                        FightAwardUI.getInstance().show();
                    })
                }

            }
        })

    }

    private onVideo(){
        PKHistoryUI.getInstance().show(this.pkData.history);
    }

    private onInfo(){
        this.infoGroup.visible = true;
        this.infoList.dataProvider = new eui.ArrayCollection(CardManager.getInstance().resetOtherList(this.pkData.otherList))
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
        if(!this.changeToServerList())
        {
            MyWindow.Alert('还没设置出战卡组')
            return
        }
        this.testSave(()=>{
            if(this.pkData.otherList) //要显示的数量
            {
                var list = CardManager.getInstance().resetOtherList(this.pkData.otherList)
                var count = 0;
                for(var i=0;i<list.length;i++)
                {
                    if(typeof list[i] == 'object')
                    {
                        if(list[i].id)
                            count ++;
                    }
                    else if(Math.floor(list[i]))
                        count ++;
                }
                PKManager.getInstance().showTopNum = count;
            }

            if(this.pkData && (this.pkData.list || this.pkData.newList))
            {
                this.pkData.fun(this.changeToServerList(),this.changeToServerHero())
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
        this.renewBtn(false,true)
    }
    private onDown(){
        this.renewBtn(true,true)
    }

    private onTest(){
        this.testSave(()=>{
            if(this.type == 'atk')
                SharedObjectManager.getInstance().setMyValue('pk_choose',this.index)
            else
                SharedObjectManager.getInstance().setMyValue('pk_choose_def',this.index)
            PosTestUI.getInstance().show(this.type,{
                list:this.changeToServerList(),
                hero:this.changeToServerHero(),
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
    public changeToServerHero(){
        var arr = [];
        var source = this.heroListData.source;
        for(var i=0;i<source.length;i++)
        {
            var item = source[i];
            if(item.id)
                arr.push(item.id)
        }
        if(arr.length == 0)
            arr.push(0);
        return arr.join(',');
    }

    public onClose(){
        if(this.pkData && (this.pkData.list || this.pkData.newList))
        {
            this.hide();
            this.pkData.hideFun && this.pkData.hideFun(this.changeToServerList(),this.changeToServerHero());
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
            b = this.posData && (this.posData.list != this.changeToServerList() || (this.posData.hero || '0') != this.changeToServerHero() )
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
        if(this.listData.length>0 && this.listData.getItemAt(this.listData.length-1).setting)
            length --;
        //if(this.pkData && this.pkData.stopAdd)
        //    this.titleText.text = ''+length;
        //else
            this.titleText.text = ''+length+' / '+this.maxCard

        var posName = this.posData && this.posData.name && Base64.decode(this.posData.name) || this.newName
        if(this.pkData)
        {
            if(this.pkData.noTab)
                posName = '';
            this.topUI.setTitle((this.pkData.title || '战斗准备') + (posName?'【'+posName+'】':''),this.pkData.helpKey || (this.type == 'atk'?'atkPos':'defPos'))

            if(this.pkData.chooseCard)
                this.topUI.setTitle(this.pkData.title + '('+length+'/'+PKChooseCardManager.getInstance().maxNum+')')

        }
        else if(this.type == 'atk')
        {
            this.topUI.setTitle(posName ||  '进攻阵容','atkPos')
        }
        else
        {
            this.topUI.setTitle(posName || '防守阵容','defPos')
        }

        //this.titleGroup.visible = !(this.pkData && this.pkData.stopAdd)
    }

    private onSave(fun?){
        if(this.pkData && (this.pkData.list || this.pkData.newList))
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
        var serverHeroList = this.changeToServerHero();
        if(this.posData)
        {
            PosManager.getInstance().changePos(this.type,this.index,serverList,serverHeroList,()=>{
                    fun && fun();
                    //MyWindow.ShowTips('保存成功！')
                })
        }
        else
        {
            PosManager.getInstance().addPos(this.type,this.index,serverList,this.newName,serverHeroList,()=>{
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

    public onHeroSelect(){
        if(this.pkData && this.pkData.stopAdd)
            return;
        var item = this.heroList.selectedItem;
        if(!item)
            return;

        if(item.setting)
        {
            BasePosHeroChooseUI.getInstance().show(ObjectUtil.arrayToObj(this.heroListData.source,'id','@whole'))
        }
        else if(!game.BaseUI.isStopEevent)
        {
            var stopDelete = this.isStopDelete();
            if(stopDelete)
                return
            var index = this.heroListData.getItemIndex(item);
            this.heroListData.removeItemAt(index)
            if(!this.heroListData.getItemAt(this.heroListData.length-1).setting)
            {
                this.heroListData.addItem({setting:true})
            }
        }
    }

    public resetHero(id){
        this.heroListData.source.pop()
        this.heroListData.source.push({id:id});
        if(this.heroListData.source.length < 5)
            this.heroListData.source.push({setting:true})
        this.heroListData.refresh();
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
    private onDragStart2(e){
        this.insertPos = 0;
        this.selectData = e.target.data;
        this.targetIndex = this.selectIndex = this.heroListData.source.indexOf(this.selectData);
        this.dragTarget2.data = e.target.data
        this.stage.addChild(this.dragTarget2);
        this.dragTarget2.x = e.data.x;
        this.dragTarget2.y = e.data.y;

        this.renewSelectItem();
    }

    private onDragMove2(e){
        this.dragTarget2.x = e.data.x - this.dragTarget2.width/2;
        this.dragTarget2.y = e.data.y - this.dragTarget2.height/2;

        var p = this.heroList.globalToLocal(e.data.x,e.data.y)
        //p.x -= 8;
        //p.y -= 10;
        //90*110
        //8/20
        var maxIndex = this.heroListData.length - 2;
        var orginIndex= Math.floor((p.x)/125) + Math.floor(p.y/140)*5;
        var index = Math.max(0,Math.min(maxIndex,orginIndex))
        //var isOver = p.x%105 >30 && p.x%105 <80;
        var lastInsetPos = this.insertPos;
        if(p.x%125 <= 35)
            this.insertPos = -1;
        else if(p.x%125 >= 90)
            this.insertPos = 1;
        else
            this.insertPos = 0;

        if(orginIndex > maxIndex || orginIndex < 0) //越界了
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

    private onDragEnd2(e){
        MyTool.removeMC(this.dragTarget2)
        var index = Math.max(0,this.insertPos + this.targetIndex)
        if(this.targetIndex != -1 && this.selectIndex != index)
        {
            if(this.insertPos == 0)
            {
                var item = this.heroListData.replaceItemAt(this.selectData,index)
                this.heroListData.replaceItemAt(item,this.selectIndex)
            }
            else
            {
                this.heroListData.removeItemAt(this.selectIndex)
                if(index > this.selectIndex && this.insertPos > 0)
                    index --;
                this.heroListData.addItemAt(this.selectData,index)
            }
        }



        this.selectData = null
        this.selectIndex = -1
        this.targetIndex = -1
        this.insertPos = 0

        this.renewSelectItem();


    }

    private renewSelectItem(){
        var isHero = this.dragTarget2.stage;
        if(isHero)
        {
            var chooseData = this.heroListData.getItemAt(this.targetIndex);
            var list = this.heroList
        }
        else
        {
            var chooseData = this.listData.getItemAt(this.targetIndex);
            var list = this.list
        }
        var swapData = this.selectData && this.targetIndex != this.selectIndex && this.insertPos==0?chooseData:null;
        var targetItem;
        for(var i=0;i<list.numChildren;i++)
        {
            var item:any = list.getChildAt(i);
            item.renewSelect(this.selectData,swapData);
            if(item.data == chooseData)
            {
                targetItem = item;
                break;
            }
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
    *   list,hero//传阵容进去
    *   noTab
    *   fun
    *   hideFun
    *   title
    *   newList
    *   helpKey
    *   stopAdd
    *   stopRemoveTips
    *   stopTest
    *   isActive
    *   cardBase
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

        this.cardBaseInfo = null;
        if(this.pkData)
        {
            this.cardBaseInfo = this.pkData.cardBase
        }
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.infoGroup.visible = false;
        this.openBtn.visible =  this.type == 'def';
        if(this.pkData && this.pkData.maxNum)
            this.maxCard = this.pkData.maxNum;
        else
            this.maxCard = PosManager.getInstance().maxPosNum();

        this.typeIcon.source = this.type == 'atk'?'icon_atk3_png':'icon_def1_png'
        this.currentState = 'normal'
        this.deleteBtnIndex = 1;
        MyTool.removeMC(this.chooseCardBtn);
        MyTool.removeMC(this.addCardBtn);
        this.btnGroup.addChildAt(this.renameBtn,0)
        if(this.pkData && this.pkData.chooseCard)
        {
            this.btnGroup.removeChildren();
            this.btnGroup.addChild(this.chooseCardBtn);
            this.onChooseCard()
            this.currentState = 'pk'
        }
        else if(this.pkData && this.pkData.fight)
        {
            this.btnGroup.removeChildren();
            if(this.pkData.otherList)
                this.btnGroup.addChild(this.infoBtn);
            this.btnGroup.addChild(this.addCardBtn);
            this.btnGroup.addChild(this.pkBtn);
            if(FightManager.getInstance().award)
            {
                FightAwardUI.getInstance().show();
            }
            this.currentState = 'pk'
        }
        else if(this.pkData)
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
            if(this.pkData.isActive)
                this.addPanelOpenEvent(GameEvent.client.active_end,this.hide)
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

        this.addPanelOpenEvent(GameEvent.client.hero_change,this.renewHeroList)
    }

    public renewHeroList(){
        MyTool.renewList(this.heroList)
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

    public renewBtn(toBottom?,mv?){
        var heroOpen = HeroManager.getInstance().isHeroOpen();
        this.upBtn.visible = false
        this.downBtn.visible = false
        this.heroList.visible = heroOpen

        var heroHeight = heroOpen?150:0
        if(heroHeight && this.heroListData.source.length == 0)
            heroHeight = 0;
        var listHeight = Math.ceil((this.listData.length)/6)*130 + 60   //多加一行
        if(this.pkData && this.pkData.noTab)
            var scrollHeight = GameManager.stage.stageHeight-60-100
        else
            var scrollHeight = GameManager.stage.stageHeight-120-100
        var listY = 0;
        if( listHeight + heroHeight > scrollHeight)
        {
            if(toBottom)
            {
                this.upBtn.visible = true
                listY = scrollHeight - listHeight
            }
            else
            {
                this.downBtn.visible = true
                listY = heroHeight

            }
        }
        else
        {
            listY = heroHeight;
        }
        var heroY = listY - 150;
        egret.Tween.removeTweens(this.list)
        egret.Tween.removeTweens(this.scrollerBG)
        egret.Tween.removeTweens(this.heroList)
        if(mv)
        {
            egret.Tween.get(this.list).to({y:listY},200)
            egret.Tween.get(this.scrollerBG).to({y:heroY},200)
            egret.Tween.get(this.heroList).to({y:heroY},200)
            return
        }

        this.list.y = listY
        this.scrollerBG.y = heroY
        this.heroList.y = heroY
    }

    public renewPKChooseCard(id,arr){
        this.listData.addItem({id:id})
        if(arr)
        {
            PKChooseCardUI.getInstance().renew();
        }
        else
        {
            this.pkData.title = '挑战关卡';
            this.pkData.chooseCard = false;
            this.btnGroup.removeChildren();
            this.btnGroup.addChild(this.pkBtn);
            PKChooseCardUI.getInstance().hide();
        }
        this.renewTitle();
    }

    public renewFightChooseCard(ids){
        for(var i=0;i<ids.length;i++)
            this.listData.addItem({id:ids[i]})
        this.renewTitle();
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
        else if(this.pkData && (this.pkData.list || this.pkData.newList))
        {
            data = {
                list:this.pkData.list || '',
                hero:this.pkData.hero,
            }
        }
        var arr = [];
        if(data || this.sp.list)
        {
            var list
            if(this.sp.list)
                list = this.sp.list;
            else
                list = data.list?data.list.split(','):[];
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

        var heroArr = [];
        if(data || this.sp.hero)
        {
            var list2 = []
            if(this.sp.hero)
                list2 = this.sp.hero;
            else if(data.hero)
                list2 = data.hero.split(',')
            for(var i=0;i<list2.length;i++)
            {
                var hid = parseInt(list2[i]) || 0;
                if(hid)
                    heroArr.push({id:hid})
            }
        }
        //else
        //{
        //    for(var i=0;i<list2.length;i++)
        //    {
        //        heroArr.push({index:i+1,id:0})
        //    }
        //}
        if(heroArr.length < 5 && !stopDelete)
            heroArr.push({setting:true})
        this.heroListData.source = heroArr
        this.heroListData.refresh()


        if(stopDelete)
            MyTool.removeMC(this.deleteBtn)
        else if(arr.length < this.maxCard)
            arr.push({setting:true})
        else if(arr.length > this.maxCard)
            arr.length = this.maxCard




        this.listData.source = arr;
        this.listData.refresh()
        this.renewTitle();
        this.renewBtn();

        var stopRemoveTips = this.pkData && this.pkData.stopRemoveTips
        if(removeSkill.length > 0 && !stopRemoveTips)
            MyWindow.ShowTips('移除了 ' + removeSkill.length + ' 张无效法术牌')


    }
}