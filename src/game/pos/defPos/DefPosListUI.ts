class DefPosListUI extends game.BaseUI {

    private static _instance: DefPosListUI;
    public static getInstance(): DefPosListUI {
        if(!this._instance)
            this._instance = new DefPosListUI();
        return this._instance;
    }

    private topUI: TopUI;
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
        this.addPanelOpenEvent(GameEvent.client.pos_change,this.renew)
    }

    public renew(){
        var PM = PosManager.getInstance();
        this.topUI.setTitle('防守阵容 （'+PM.defList.length+'/5）')
        var arr = PM.defList.concat();
        if(arr.length < PM.maxNum)
            arr.push({empty:true})

        for(var i=0;i<arr.length;i++)
        {
            arr[i].index = i;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}