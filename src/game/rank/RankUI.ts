class RankUI extends game.BaseUI {

    private static _instance: RankUI;
    public static getInstance(): RankUI {
        if(!this._instance)
            this._instance = new RankUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;


    private typeObj = {
        0:{key:'force',name:'战力'},
        1:{key:'hang',name:'战役'},
        2:{key:'hourcoin',name:'生产'},
    }
    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();


        this.bottomUI.setHide(this.hide,this);

        this.scroller.viewport = this.list;
        this.list.itemRenderer = RankItem

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){
        this.topUI.setTitle(this.typeObj[this.tab.selectedIndex].name);
        this.getData();
    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.topUI.setTitle(this.typeObj[this.tab.selectedIndex].name + '排行');
        this.getData();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public getData(){
       RankManager.getInstance().getServerRank(this.typeObj[this.tab.selectedIndex].key,()=>{
          this.renew();
       })
    }

    public renew(){
        this.list.dataProvider = new eui.ArrayCollection(RankManager.getInstance().getRankList(this.typeObj[this.tab.selectedIndex].key))
    }
}