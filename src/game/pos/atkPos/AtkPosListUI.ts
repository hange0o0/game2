class AtkPosListUI extends game.BaseUI {

    private static _instance: AtkPosListUI;
    public static getInstance(): AtkPosListUI {
        if(!this._instance)
            this._instance = new AtkPosListUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private bottomUI: BottomUI;
    private topUI: TopUI;




    public constructor() {
        super();
        this.skinName = "AtkPosListUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);

        this.scroller.viewport = this.list;
        this.list.itemRenderer = AtkPosListItem
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
        this.topUI.setTitle('进攻阵容 （'+PM.atkList.length+'/5）')
        var arr = PM.atkList.concat();
        if(arr.length < PM.maxNum)
            arr.push({empty:true})

        for(var i=0;i<arr.length;i++)
        {
            arr[i].index = i;
        }


        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}