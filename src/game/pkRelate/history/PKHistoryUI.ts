class PKHistoryUI extends game.BaseWindow {

    private static _instance: PKHistoryUI;
    public static getInstance(): PKHistoryUI {
        if(!this._instance)
            this._instance = new PKHistoryUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private closeBtn: eui.Image;




    private listData
    public constructor() {
        super();
        this.skinName = "PKHistoryUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = MailPKItem;
    }

    public show(list?){
        list = list || []
        if(list.length == 0)
        {
            MyWindow.ShowTips('没有可观看的记录')
            return;
        }
        this.listData = list;
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }


    public renew(){
        this.list.dataProvider = new eui.ArrayCollection(this.listData);
    }
}