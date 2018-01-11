class BagUI extends MainBase {

    private static _instance: BagUI;
    public static getInstance(): BagUI {
        if(!this._instance)
            this._instance = new BagUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;




    public constructor() {
        super();
        this.skinName = "BagUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = BagItem
        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
    }

    private onScroll(){
        MainUI.getInstance().setTopPos(this.scroller.viewport.scrollV)
    }



    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){

    }
}