class BasePosChooseUI extends game.BaseUI {

    private static _instance: BasePosChooseUI;
    public static getInstance(): BasePosChooseUI {
        if(!this._instance)
            this._instance = new BasePosChooseUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private emptyGroup: eui.Group;



    //public selectType
    //private monsterType = 0
    //private skillType = 0

    private arrayData:eui.ArrayCollection
    private fromUI:BasePosUI
    private posCard = new PosCardItem()

    public isFull

    public constructor() {
        super();
        this.skinName = "BasePosChooseUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);

        this.scroller.viewport = this.list;
        this.list.itemRenderer = PosCardItem
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);

        //this.scroller2.viewport = this.list2;
        //this.list2.itemRenderer = PosCardItem
        //this.list2.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);

        //var arr = CM.m_shows.getLevelList();
        //this.downList.setData(arr,0);
        //this.downList.addEventListener(DownList.SELECT,this.onTab,this);
        //this.downList2.addEventListener(DownList.SELECT,this.onDownListSelect,this);


        //this.selectType = 0;

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;

        this.posCard.stopGay = true
    }
    //
    //
    //private getListData(){
    //    return this.arrayData.source;
    //}

    //private onDownListSelect(){
    //    if(this.tab.selectedIndex == 0)
    //          this.monsterType = this.downList2.selectValue;
    //    else
    //          this.skillType = this.downList2.selectValue;
    //    this.renewList();
    //}

    private onTab(){
        //this.renewDownList();
        this.renewList();
        if(this.tab.selectedIndex == 3 && !SharedObjectManager.getInstance().getMyValue('skill_tips'))
        {
            SharedObjectManager.getInstance().setMyValue('skill_tips',true)
            SkillCardAlertUI.getInstance().show();
            //MyWindow.Alert('法术卡牌在战斗中会被消耗！\n法术卡牌在战斗中会被消耗！\n法术卡牌在战斗中会被消耗！',()=>{
            //    MyWindow.Alert('如果你战斗胜出，未使用的法术卡牌会被返还。',()=>{
            //        MyWindow.Alert('如果你战斗失败，则本轮出战的所有法术卡牌都会被移除！',()=>{
            //
            //        })
            //    })
            //})
        }
    }

    //选中
    private onSelect(){
        if(game.BaseUI.isStopEevent)
            return;

        var item = this.list.selectedItem;
        if(this.fromUI.maxCard <= this.arrayData.length)
        {
            MyWindow.ShowTips('上阵卡牌已达上限')
            return;
        }
        //达单次上阵数量上限
        if(this.fromUI.useCard[item.id] && this.fromUI.useCard[item.id] >= PosManager.getInstance().oneCardNum)
            return;

        //没可用技能了
        if(item.id > PKConfig.skillBeginID && this.fromUI.useCard[item.id] && this.fromUI.useCard[item.id] >= CardManager.getInstance().getSkillNum(item.id))
            return;

        this.fromUI.useCard[item.id] = (this.fromUI.useCard[item.id] || 0) + 1
        this.arrayData.addItem({id:item.id})
        this.isFull = this.fromUI.maxCard <= this.arrayData.length
        this.renewTitle();
        this.justRenewList2();

        for(var i=0;i<this.list.numChildren;i++)
        {
            var mc:any = this.list.getChildAt(i);
            if(mc.data == item)
            {
                this.showAdd(mc)
                break;
            }
        }
        //this.once(egret.Event.ENTER_FRAME,function(){
        //    var dec = this.scroller1.viewport.contentHeight -  this.scroller1.viewport.height;
        //    if(this.scroller1.viewport.scrollV < dec)
        //    {
        //        this.scroller1.viewport.scrollV = dec
        //        this.onScroll();
        //    }
        //},this)
        //
        //this.btnGroup.addChildAt(this.deleteBtn,0)

    }

    private showAdd(mc){
        var p = mc.localToGlobal(0,0)
        this.posCard.x = p.x;
        this.posCard.y = p.y;
        this.addChild(this.posCard);
        this.posCard.data = mc.data;
        egret.Tween.removeTweens(this.posCard)
        this.posCard.alpha = 1;
        this.posCard.touchChildren = this.posCard.touchEnabled = false
        var tw = egret.Tween.get(this.posCard)
        tw.to({alpha:0,y:p.y-100},200).call(function(){
             MyTool.removeMC(this.posCard)
        },this)
    }



    //private renewDownList(){
    //    //this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
    //    if(this.tab.selectedIndex == 0)
    //    {
    //        var arr = [
    //            {label:'全部',label2: 'x' + CardManager.getInstance().getMyMonsterList(0).length,data:0,icon: 'monster_all_icon_png'},
    //            {label:PKConfig.TYPENAME[1],label2: 'x' + CardManager.getInstance().getMyMonsterList(1).length,data:1,icon: 'icon_type1_png'},
    //            {label:PKConfig.TYPENAME[2],label2: 'x' + CardManager.getInstance().getMyMonsterList(2).length,data:2,icon: 'icon_type2_png'},
    //            {label:PKConfig.TYPENAME[3],label2: 'x' + CardManager.getInstance().getMyMonsterList(3).length,data:3,icon: 'icon_type3_png'}];
    //        this.downList2.setData(arr,this.monsterType);
    //    }
    //    else
    //    {
    //        var arr = [
    //            {label:'全部',label2: 'x' + CardManager.getInstance().getMySkillList(0).length,data:0,icon:'skill_all_icon_png'},
    //            {label:PKConfig.SKILLTYPENAME[1],label2: 'x' + CardManager.getInstance().getMySkillList(1).length,data:1,icon: 'skill_type1_png'},
    //            {label:PKConfig.SKILLTYPENAME[2],label2: 'x' + CardManager.getInstance().getMySkillList(2).length,data:2,icon: 'skill_type2_png'},
    //            {label:PKConfig.SKILLTYPENAME[3],label2: 'x' + CardManager.getInstance().getMySkillList(3).length,data:3,icon: 'skill_type3_png'},
    //            {label:PKConfig.SKILLTYPENAME[4],label2: 'x' + CardManager.getInstance().getMySkillList(4).length,data:4,icon: 'skill_type4_png'},
    //            {label:PKConfig.SKILLTYPENAME[5],label2: 'x' + CardManager.getInstance().getMySkillList(5).length,data:5,icon: 'skill_type5_png'}];
    //        this.downList2.setData(arr,this.skillType);
    //    }
    //}


    public show(list?,fromUI?){
        this.arrayData = list;
        this.fromUI = fromUI;
        this.arrayData.removeItemAt(this.arrayData.length - 1)
        super.show()
    }

    public hide() {
        MyTool.clearList(this.list)
        super.hide();
        this.fromUI.resetData()
    }

    public onShow(){
        var list = [
            {label:PKConfig.TYPENAME[1]},
            {label:PKConfig.TYPENAME[2]},
            {label:PKConfig.TYPENAME[3]},
            {label:'法术'},
        ]
        if(this.fromUI.type == 'def')
        {
            list.pop();
            this.tab.width = 450
            if(this.tab.selectedIndex == 3)
                this.tab.selectedIndex = 0;
        }
        else
            this.tab.width = 600

        this.tab.dataProvider = new eui.ArrayCollection(list);
        this.isFull = false;
        this.renew();
        this.renewTitle();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)

        if(BasePosUI.getInstance().pkData && BasePosUI.getInstance().pkData.isPVP)
            this.addPanelOpenEvent(GameEvent.client.PVP_END,this.hide)
    }

    private renewTitle(){
        var title = this.fromUI.type == 'atk'?'进攻卡牌':'防御卡牌'
        this.topUI.setTitle('添加' + title + ' ('+this.arrayData.length+'/'+this.fromUI.maxCard+')','posChoose')
    }

    public renew(){
        //var PM = PosManager.getInstance();
        this.renewList();
        //this.renewDownList();
    }

    public justRenewList2(){
        MyTool.renewList(this.list)
    }
    public addSetting(){
        this.arrayData.addItem({isSetting:true})
    }

    private renewList(){
        var type = this.tab.selectedIndex + 1;
        var arr;
        if(this.tab.selectedIndex == 3)
        {
            arr = CardManager.getInstance().getMySkillList(0)
        }
        else
        {
            arr = CardManager.getInstance().getMyMonsterList(type)
        }
        ArrayUtil.sortByField(arr,['cost','level','id'],[0,0,0]);
        for(var i=0;i<arr.length;i++)
        {
            arr[i].temp = this.fromUI.useCard;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)

        this.emptyGroup.visible = arr.length == 0

    }
}