class CardUI extends MainBase {

    private static _instance: CardUI;
    public static getInstance(): CardUI {
        if(!this._instance)
            this._instance = new CardUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private downList2: DownList;


    private monsterType = 0
    private skillType = 0
    private dataArray = new eui.ArrayCollection()

    //public isFirst = true

    public constructor() {
        super();
        this.skinName = "CardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CardItem
        this.list.dataProvider = this.dataArray
        this.downList2.addEventListener(DownList.SELECT,this.onDownListSelect,this);


        //this.selectType = 0;

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){
        this.renewDownList();
        this.renewList();
    }

    private onDownListSelect(){
        if(this.tab.selectedIndex == 0)
            this.monsterType = this.downList2.selectValue;
        else
            this.skillType = this.downList2.selectValue;
        this.renewList();
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


    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        this.renewDownList();
        this.renewList();
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
        this.dataArray.source = arr;
        this.dataArray.refresh()
        //this.list.dataProvider = new eui.ArrayCollection(arr)

    }
}