class HelpUI extends game.BaseWindow {

    private static _instance: HelpUI;
    public static getInstance(): HelpUI {
        if(!this._instance)
            this._instance = new HelpUI();
        return this._instance;
    }

    private titleText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;

    private dataIn;

    public constructor() {
        super();
        this.skinName = "HelpUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list
        this.list.useVirtualLayout = false;
    }

    public show(v?){
        this.dataIn = v;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }

    public renew(){
        this.titleText.text = this.dataIn.title;
        var arr = [];
        for(var i=0;i<this.dataIn.list.length;i++)
        {
            arr.push({text:this.dataIn.list[i]})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}