class HangHelpUI extends game.BaseWindow {

    private static _instance: HangHelpUI;
    public static getInstance(): HangHelpUI {
        if(!this._instance)
            this._instance = new HangHelpUI();
        return this._instance;
    }

    private list: eui.List;
    private titleText: eui.Label;
    private closeBtn: eui.Group;

    public constructor() {
        super();
        this.skinName = "HangHelpUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = HangHelpItem;
        this.addBtnEvent(this.closeBtn,this.hide)
    }

    public show(fun?){
        HangManager.getInstance().getVideoList(()=>{
            if(HangManager.getInstance().videoData.list.length == 0)
            {
                MyWindow.Alert('暂无人通过本关')
                return;
            }
            super.show()
        })

    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        var arr = HangManager.getInstance().videoData.list;
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}