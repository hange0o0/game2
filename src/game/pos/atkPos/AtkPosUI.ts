class AtkPosUI extends game.BaseUI {

    private static _instance: AtkPosUI;
    public static getInstance(): AtkPosUI {
        if(!this._instance)
            this._instance = new AtkPosUI();
        return this._instance;
    }

    private topUI: TopUI;
    private scrollerBG: eui.Rect;
    private scroller1: eui.Scroller;
    private list1: eui.List;
    private scroller2: eui.Scroller;
    private list2: eui.List;
    private tab: eui.TabBar;
    private insertBtn: eui.Label;
    private downList: DownList;
    private keyBoard: AtkPosKeyBoard;
    private bottomUI: BottomUI;
    private deleteBtn: eui.Label;
    private renameBtn: eui.Label;
    private saveBtn: eui.Label;



    private monsterType = 0
    private skillType = 0
    private index = 0
    public insertPos = 0
    public useCard = {}

    private posName = ''
    private arrayData:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "AtkPosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);
        this.keyBoard.hide();
        this.keyBoard.addEventListener('key_change',this.onKeyBoard,this)

        this.addBtnEvent(this.insertBtn,this.onInsert)
        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.renameBtn,this.onRename)
        this.addBtnEvent(this.saveBtn,this.onSave)

        this.scroller1.viewport = this.list1;
        this.list1.itemRenderer = AtkPosItem
        this.scroller1.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        this.scroller1.addEventListener(eui.UIEvent.CHANGE_END,this.renewInsert,this)

        this.scroller2.viewport = this.list2;
        this.list2.itemRenderer = PosCardItem
        this.list2.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);

        //var arr = CM.m_shows.getLevelList();
        //this.downList.setData(arr,0);
        this.downList.addEventListener(DownList.SELECT,this.onDownListSelect,this);

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
    }

    private onScroll(){
        this.scrollerBG.y = 50 - this.scroller2.viewport.scrollV;
    }


    private onDelete(){

    }
    private onRename(){

    }
    private onSave(){

    }
    private onInsert(){
        this.keyBoard.show();
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

    //选中
    private onSelect(){
        var item = this.list2.selectedItem;
        if(this.useCard[item.id] && this.useCard[item.id] >= 3)
            return;
        this.useCard[item.id] = (this.useCard[item.id] || 0) + 1
        this.arrayData.addItemAt(item.id,this.index)
        this.index ++;
        this.renewInsert();
        this.justRenewList2();
    }

    private renewDownList(){
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

    private onKeyBoard(e){
         switch(e.data)
         {
             case 'delete':
                 if(this.index <= 0)
                    return;
                 var item = this.arrayData.getItemAt(this.index-1)
                 this.useCard[item.id] --;
                 this.arrayData.removeItemAt(this.index);
                 this.renewInsert();
                 break
             case 'up':
                 break
             case 'down':
                 break
             case 'left':
                 break
             case 'right':
                 break
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
        var data = PM.atkList[this.index]
        this.useCard = {};
        if(data)
        {
            this.posName = data.name;
            this.arrayData = new eui.ArrayCollection(data.list)
            this.insertPos = data.list.length;
            for(var i=0;i<data.list.length;i++)
            {
                this.useCard[data.list[i]] = (this.useCard[data.list[i]] || 0) + 1
            }
        }
        else
        {
            this.posName = '未命名' + this.index;
            this.arrayData = new eui.ArrayCollection([])
            this.insertPos = 0;
        }
        this.list1.dataProvider = this.arrayData
        this.topUI.setTitle(this.posName)
        this.renewList();
        this.renewInsert();
    }

    private renewInsert(){
        this.once(egret.Event.ENTER_FRAME,function(){
            for(var i=0;i<this.list1.numChildren;i++)
            {
                this.list1.getChildAt(i)['renewInsert'](i);
            }
        },this)
    }

    private justRenewList2(){
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
        this.list2.dataProvider = new eui.ArrayCollection(arr)
    }
}