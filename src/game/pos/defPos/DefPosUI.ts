class DefPosUI extends game.BaseUI {

    private static _instance: DefPosUI;
    public static getInstance(): DefPosUI {
        if(!this._instance)
            this._instance = new DefPosUI();
        return this._instance;
    }

    private scrollerBG: eui.Image;
    private arrowBtn: eui.Image;
    private topUI: TopUI;
    private scroller1: eui.Scroller;
    private list1: eui.List;
    private scroller2: eui.Scroller;
    private list2: eui.List;
    private tab: eui.TabBar;
    private downList: DownList;
    private bottomUI: BottomUI;
    private renameBtn: eui.Group;
    private deleteBtn: eui.Group;
    private saveBtn: eui.Group;
    private testBtn: eui.Group;
    private btnGroup: eui.Group;








    private monsterType = 0
    private skillType = 0
    private index = 0  //第X个阵
    public useCard = {}

    private posName = ''
    private posData
    private arrayData:eui.ArrayCollection
    private itemWidth = 220;

    public scrollChangeTime = 0

    public constructor() {
        super();
        this.skinName = "DefPosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.onClose,this);
        //this.keyBoard.hide();
        //this.keyBoard.addEventListener('key_change',this.onKeyBoard,this)

        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.renameBtn,this.onRename)
        this.addBtnEvent(this.saveBtn,this.onSave)
        this.addBtnEvent(this.arrowBtn,this.onArrow)
        this.addBtnEvent(this.testBtn,this.onTest)

        this.scroller1.viewport = this.list1;
        this.list1.itemRenderer = DefPosItem
        this.scroller1.addEventListener(egret.Event.CHANGE,this.onScroll,this)

        //this.scroller1.addEventListener(egret.TouchEvent.TOUCH_CANCEL,()=>{console.log('cancle')},this)
        //this.scroller1.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{console.log('tap')},this)

        this.scroller2.viewport = this.list2;
        this.list2.itemRenderer = PosCardItem
        this.list2.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);

        //var arr = CM.m_shows.getLevelList();
        //this.downList.setData(arr,0);
        this.downList.addEventListener(DownList.SELECT,this.onDownListSelect,this);

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTest(){
        PosTestUI.getInstance().show('def',{
            list:this.changeToServerList(),
            name:Base64.encode(this.posName),
        })
    }

    private onScroll(){
        this.scrollChangeTime = egret.getTimer()
        this.scrollerBG.x = -this.scroller1.viewport.scrollH * 0.1;
        if(this.scrollerBG.x < 640 - this.scrollerBG.width)
            this.scrollerBG.x = 640 - this.scrollerBG.width
    }

    private onArrow(){
         if(Config.isDebug)
         {
             this.addItem({id:-1});
         }
    }

    public changeToServerList(){
        var arr = [];
         for(var i=0;i<this.arrayData.length;i++)
         {
             arr.push(this.arrayData.getItemAt(i).ids.join('#'))
         }
        return arr.join(',');
    }

    public onClose(){
        if(!this.posData && this.arrayData.length > 0)
        {
            Confirm('还没保存，确定退出吗？',(b)=>{
                if(b==1)
                {
                    this.hide();
                }
            })
            return;
        }
        if(this.posData && (Base64.decode(this.posData.name) != this.posName || this.posData.list != this.changeToServerList()))
        {
            Confirm('还没保存，确定退出吗？',(b)=>{
                if(b==1)
                {
                    this.hide();
                }
            })
            return;
        }
        this.hide();
    }


    private onDelete(){
         Confirm('确定要删除该阵法吗？',(b)=>{
             if(b==1)
             {
                 PosManager.getInstance().deletePos('def',this.posData.id,()=>{
                     this.index = PosManager.getInstance().defList.length;
                     this.renew();
                     //this.hide();
                 })
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

    private onSave(){
        if(this.arrayData.length == 0)
        {
            Alert('必须上阵最少一张卡牌')
            return
        }
        var serverList = this.changeToServerList();
         if(this.posData)
         {
             PosManager.getInstance().changePos('def',this.posData.id,
                 this.posName,serverList,()=>{
                     ShowTips('保存成功！')
                     this.hide();
             })
         }
        else
         {
             PosManager.getInstance().addPos('def',
                 this.posName,serverList,()=>{
                     ShowTips('保存成功！')
                     this.hide();
                     //this.posData = PosManager.getInstance().defList[this.index]
                 })
         }
    }


    private onDownListSelect(){
        if(this.tab.selectedIndex == 0)
            this.monsterType = this.downList.selectValue;
        else
            this.skillType = this.downList.selectValue;
        this.renewList();
    }

    private onTab(){
        this.renewDownList();
        this.renewList();
    }



    private renewDownList(){
        this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
        if(this.tab.selectedIndex == 0)
        {
            var arr = [
                {label:'全部',data:0},
                {label:'类型1',data:1},
                {label:'类型2',data:2},
                {label:'类型3',data:3}];
            this.downList.setData(arr,this.monsterType);
        }
        else
        {
            var arr = [
                {label:'全部',data:0},
                {label:'攻击',data:1},
                {label:'治疗',data:2},
                {label:'辅助',data:3},
                {label:'召唤',data:4}];
            this.downList.setData(arr,this.skillType);
        }
    }


    public show(v?){
        this.index = v;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var PM = PosManager.getInstance();
        var data = this.posData = PM.defList[this.index]
        this.useCard = {};
        if(data)
        {
            this.posName = Base64.decode(data.name) || '未命名';
            var arr = [];

            var list = data.list.split(',');
            var len = list.length;
            for(var i=0;i<len;i++)
            {
                var ids = (list[i] + '').split('#');
                for(var j=0;j<ids.length;j++)
                {
                    var id = ids[j];
                    this.useCard[id] = (this.useCard[id] || 0) + 1;
                }
                arr.push({ids:ids,cd:0,preLen:0})
            }
            this.arrayData = new eui.ArrayCollection(arr)
            if(PM.defList.length > 1)
                this.btnGroup.addChildAt(this.deleteBtn,0)
            else
                MyTool.removeMC(this.deleteBtn)
        }
        else
        {
            this.posName = '未命名' + this.index;
            this.arrayData = new eui.ArrayCollection([])
            MyTool.removeMC(this.deleteBtn)
        }
        this.resetDefData();
        this.list1.dataProvider = this.arrayData
        this.renewTitle();
        this.renewList();
        this.renewDownList();
    }

    private resetDefData(renew?){
        var mpCost = 0;
        var preLen = 4;
        for(var i=0;i<this.arrayData.length;i++)
        {
            var item = this.arrayData.getItemAt(i);
            item.preLen = preLen;
            if(item.ids[0] < 0)
            {
                var mp = Math.abs(item.ids[0]);
                item.cd = PKTool.getMPTime(mp + mpCost);
                mpCost += mp;
                preLen = 5;
            }
            else
            {
                var mp = PKTool.getGroupMp(item.ids);
                item.cd = PKTool.getMPTime(mp + mpCost);
                mpCost += mp;
                preLen = item.ids.length;
            }
        }

        if(renew)
            MyTool.renewList(this.list1);
    }

    private getTotalNum(){
        var count = 0;
        for(var s in this.useCard)
        {
            count += this.useCard[s];
        }
        return count;
    }

    //选中
    private onSelect(){
        var item = this.list2.selectedItem;
        if(this.useCard[item.id] && this.useCard[item.id] >= 3)
            return;
        if(this.getTotalNum() >= PosManager.getInstance().maxPosNum())
            return;
        this.useCard[item.id] = (this.useCard[item.id] || 0) + 1
        this.addItem(item)
    }

    private addItem(item){
        var index = Math.min(this.arrayData.length,Math.floor((this.scroller1.viewport.scrollH+this.itemWidth/2)/this.itemWidth));
        this.arrayData.addItemAt({ids:[item.id],cd:0,preLen:0},index);

        this.resetDefData(true);
        this.justRenewList2();
        this.renewTitle();

        egret.Tween.removeTweens(this.scroller1.viewport)
        var tw = egret.Tween.get(this.scroller1.viewport,{onChange:()=>{this.onScroll()}})
        tw.to({scrollH:(index+1)*this.itemWidth},100)
    }

    public deleteItem(data){
        var index = this.arrayData.getItemIndex(data);
        this.arrayData.removeItemAt(index);
        var id = data.ids[0];
        this.useCard[id] --;
        this.resetDefData(true);
        this.justRenewList2();
        this.renewTitle();

        this.resetScrollH1(1);

    }

    public splitItem(data){
        var index = this.arrayData.getItemIndex(data);
        this.arrayData.removeItemAt(index);
        for(var i=0;i<data.ids.length;i++)
        {
            this.arrayData.addItemAt({ids:[data.ids[i]],cd:0,preLen:0},index+i);
        }
        this.resetDefData(true);
    }

    public mergeItem(data){
        var index = this.arrayData.getItemIndex(data);
        this.arrayData.removeItemAt(index);

        var preItem = this.arrayData.getItemAt(index - 1);
        if(preItem.ids[0]<0)
            preItem.ids[0] += data.ids[0];
        else
            preItem.ids = preItem.ids.concat(data.ids);

        this.resetDefData(true);

        this.resetScrollH1(1);
    }

    private resetScrollH1(deleteNum){
        var viewport = this.list1;
        var newWidth = viewport.contentWidth - deleteNum * this.itemWidth
        if(viewport.scrollH + viewport.width > newWidth)
        {
            egret.Tween.removeTweens(this.scroller1.viewport)
            var tw = egret.Tween.get(this.scroller1.viewport,{onChange:()=>{this.onScroll()}})
            tw.to({scrollH:Math.max(0,newWidth - viewport.width)},100)
        }
    }


    private renewTitle(){
        this.topUI.setTitle(this.posName + '  ('+this.getTotalNum() +'/'+ PosManager.getInstance().maxPosNum()+')')
    }

    public justRenewList2(){
        MyTool.renewList(this.list2)
    }

    private renewList(){
        var type = this.downList.selectValue;
        var arr;
        if(this.tab.selectedIndex == 0)
        {
            arr = CardManager.getInstance().getMyMonsterList(type)
        }
        else
        {
            arr = CardManager.getInstance().getMySkillList(type)
        }
        for(var i=0;i<arr.length;i++)
        {
            arr[i].temp = this.useCard;
        }
        this.list2.dataProvider = new eui.ArrayCollection(arr)
    }
}