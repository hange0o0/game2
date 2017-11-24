class DefPosListUI extends game.BaseUI {

    private static _instance: DefPosListUI;
    public static getInstance(): DefPosListUI {
        if(!this._instance)
            this._instance = new DefPosListUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private bottomUI: BottomUI;




    public constructor() {
        super();
        this.skinName = "DefPosListUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);

        this.scroller.viewport = this.list;
        this.list.itemRenderer = DefPosListItem
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
        var PM = PosManager.getInstance();
        var arr = PM.defendList.concat();
        if(arr.length < PM.maxNum)
            arr.push({empty:true})

        for(var i=0;i<arr.length;i++)
        {
            arr[i].index = i;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}