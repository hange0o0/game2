class BasePosChooseUI extends game.BaseUI {

    private static _instance: BasePosChooseUI;
    public static getInstance(): BasePosChooseUI {
        if(!this._instance)
            this._instance = new BasePosChooseUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private tab: eui.TabBar;
    private downList2: DownList;
    private scroller: eui.Scroller;
    private list: eui.List;



    //public selectType
    private monsterType = 0
    private skillType = 0

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
        this.downList2.addEventListener(DownList.SELECT,this.onDownListSelect,this);


        //this.selectType = 0;

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;

        this.posCard.touchChildren = this.posCard.touchEnabled = false
        this.posCard.stopGay = true
    }
    //
    //
    //private getListData(){
    //    return this.arrayData.source;
    //}

    private onDownListSelect(){
        if(this.tab.selectedIndex == 0)
              this.monsterType = this.downList2.selectValue;
        else
              this.skillType = this.downList2.selectValue;
        this.renewList();
    }

    private onTab(){
        this.renewDownList();
        this.renewList();
    }

    //选中
    private onSelect(){
        if(game.BaseUI.isStopEevent)
            return;

        var item = this.list.selectedItem;
        if(this.fromUI.maxCard <= this.arrayData.length)
        {
            ShowTips('上阵卡牌已达上限')
            return;
        }
        if(this.fromUI.useCard[item.id] && this.fromUI.useCard[item.id] >= PosManager.getInstance().oneCardNum)
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
        var tw = egret.Tween.get(this.posCard)
        tw.to({alpha:0,y:p.y-100},200).call(function(){
             MyTool.removeMC(this.posCard)
        },this)
    }



    private renewDownList(){
        //this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
        if(this.tab.selectedIndex == 0)
        {
            var arr = [
                {label:'全部',label2: 'x' + CardManager.getInstance().getMyMonsterList(0).length,data:0,icon: 'monster_all_icon_png'},
                {label:PKConfig.TYPENAME[1],label2: 'x' + CardManager.getInstance().getMyMonsterList(1).length,data:1,icon: 'icon_type1_png'},
                {label:PKConfig.TYPENAME[2],label2: 'x' + CardManager.getInstance().getMyMonsterList(2).length,data:2,icon: 'icon_type2_png'},
                {label:PKConfig.TYPENAME[3],label2: 'x' + CardManager.getInstance().getMyMonsterList(3).length,data:3,icon: 'icon_type3_png'}];
            this.downList2.setData(arr,this.monsterType);
        }
        else
        {
            var arr = [
                {label:'全部',label2: 'x' + CardManager.getInstance().getMySkillList(0).length,data:0,icon:'skill_all_icon_png'},
                {label:PKConfig.SKILLTYPENAME[1],label2: 'x' + CardManager.getInstance().getMySkillList(1).length,data:1,icon: 'skill_type1_png'},
                {label:PKConfig.SKILLTYPENAME[2],label2: 'x' + CardManager.getInstance().getMySkillList(2).length,data:2,icon: 'skill_type2_png'},
                {label:PKConfig.SKILLTYPENAME[3],label2: 'x' + CardManager.getInstance().getMySkillList(3).length,data:3,icon: 'skill_type3_png'},
                {label:PKConfig.SKILLTYPENAME[4],label2: 'x' + CardManager.getInstance().getMySkillList(4).length,data:4,icon: 'skill_type4_png'},
                {label:PKConfig.SKILLTYPENAME[5],label2: 'x' + CardManager.getInstance().getMySkillList(5).length,data:5,icon: 'skill_type5_png'}];
            this.downList2.setData(arr,this.skillType);
        }
    }


    public show(list?,fromUI?){
        this.arrayData = list;
        this.fromUI = fromUI;
        this.arrayData.removeItemAt(this.arrayData.length - 1)
        super.show()
    }

    public hide() {
        super.hide();
        this.fromUI.resetData()
    }

    public onShow(){
        this.isFull = false;
        this.renew();
        this.renewTitle();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    private renewTitle(){
        var title = this.fromUI.type == 'atk'?'选择进攻卡牌':'选择防御卡牌'
        this.topUI.setTitle(title + ' ('+this.arrayData.length+'/'+this.fromUI.maxCard+')')
    }

    public renew(){
        //var PM = PosManager.getInstance();
        this.renewList();
        this.renewDownList();
    }

    public justRenewList2(){
        MyTool.renewList(this.list)
    }
    public addSetting(){
        this.arrayData.addItem({isSetting:true})
    }

    private renewList(){
        var type = this.downList2.selectValue;
        var arr;
        if(this.tab.selectedIndex == 0)
        {
            arr = CardManager.getInstance().getMyMonsterList(type)
        }
        else
        {
            arr = CardManager.getInstance().getMySkillList(type)
        }
        ArrayUtil.sortByField(arr,['cost','level','id'],[0,0,0]);
        for(var i=0;i<arr.length;i++)
        {
            arr[i].temp = this.fromUI.useCard;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)

    }
}