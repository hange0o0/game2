class BagUI extends MainBase {

    private static _instance: BagUI;
    public static getInstance(): BagUI {
        if(!this._instance)
            this._instance = new BagUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;

    private dataArray = new eui.ArrayCollection()

    public constructor() {
        super();
        this.skinName = "BagUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;

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
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var arr = [1,1,1,1,1,1,1,1,1];
        if(this.tab.selectedIndex == 1)
        {
            this.list.itemRenderer = BagItem
            this.list.layout['requestedColumnCount'] = 1
            this.list.layout['paddingLeft'] = 15
            this.list.layout['verticalGap'] = 10
        }
        else
        {
            this.list.itemRenderer = BagItem2
            this.list.layout['requestedColumnCount'] = 3
            this.list.layout['paddingLeft'] = 50
            this.list.layout['verticalGap'] = 20
        }
        this.dataArray.source = arr
        this.dataArray.refresh()
    }
}