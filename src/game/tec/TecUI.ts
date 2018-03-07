class TecUI extends MainBase {

    private static _instance: TecUI;
    public static getInstance(): TecUI {
        if(!this._instance)
            this._instance = new TecUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private coinText: eui.Label;


    private dataArray = new eui.ArrayCollection()

    public constructor() {
        super();
        this.skinName = "TecUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = TecItem
        this.list.dataProvider = this.dataArray

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){
         this.renew();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.tec_change,this.renew)
    }

    public renew(){
        if(this.tab.selectedIndex == 2)
        {
            this.currentState = 'coin'
            this.coinText.text = NumberUtil.addNumSeparator(UM.hourcoin) + '/小时'
        }
        else
            this.currentState = 'normal'
        var arr =  TecManager.getInstance().getListByType(this.tab.selectedIndex + 1);
        this.dataArray.source = arr
        this.dataArray.refresh()
    }

    public setTab(index){
        this.tab.selectedIndex = index;
        this.renew();
    }
}