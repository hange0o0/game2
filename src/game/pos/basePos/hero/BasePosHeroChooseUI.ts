class ChangeHeadUI extends game.BaseWindow {

    private static _instance: ChangeHeadUI;
    public static getInstance(): ChangeHeadUI {
        if(!this._instance)
            this._instance = new ChangeHeadUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;
    private closeBtn: eui.Image;




    private dataIn;
    public constructor() {
        super();
        this.skinName = "ChangeHeadUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = BasePosHeroChooseItem;
    }



    public show(v?){
        this.dataIn = v;
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var arr = HeroManager.getInstance().getMyHeroList();
        var list = [];
        for(var i=0;i<arr.length;i++)
        {
            list.push({

            })
        }
        this.list.dataProvider = new eui.ArrayCollection(list)
    }
}