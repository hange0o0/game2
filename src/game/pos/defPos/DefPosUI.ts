class DefPosUI extends game.BaseUI {

    private static _instance: DefPosUI;
    public static getInstance(): DefPosUI {
        if(!this._instance)
            this._instance = new DefPosUI();
        return this._instance;
    }

    private scroller1: eui.Scroller;
    private list1: eui.List;
    private scroller2: eui.Scroller;
    private list2: eui.List;
    private tab: eui.TabBar;
    private downList: DownList;
    private bottomUI: BottomUI;


    public constructor() {
        super();
        this.skinName = "DefPosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public show(){
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

    }
}