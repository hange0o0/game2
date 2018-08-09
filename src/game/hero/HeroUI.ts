class HeroUI extends MainBase {

    private static _instance: HeroUI;
    public static getInstance(): HeroUI {
        if(!this._instance)
            this._instance = new HeroUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    public list: eui.List;
    private tab: eui.TabBar;
    private emptyGroup: eui.Group;




    private dataArray = new eui.ArrayCollection()
    public constructor() {
        super();
        this.skinName = "HeroUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = HeroItem
        this.list.dataProvider = this.dataArray

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }


    private onTab(){
        this.renewList();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.hero_change,this.justRenewList)
    }


    public justRenewList(){
        MyTool.renewList(this.list)
    }

    public renew(){
        this.renewList();
    }

    private renewList(){
        var HM = HeroManager.getInstance();
        var arr;
        if(this.tab.selectedIndex == 0)
        {
            arr =HM.getMyHeroList()
            ArrayUtil.sortByField(arr,['temp','id'],[1,0]);
        }
        else
        {
            arr =HM.getTotalHeroList()
            ArrayUtil.sortByField(arr,['id'],[0]);
        }

        this.dataArray.source = arr;
        this.dataArray.refresh()
        this.emptyGroup.visible = arr.length == 0
    }

    public getCurrentList(){
        return  this.dataArray.source;
    }
}