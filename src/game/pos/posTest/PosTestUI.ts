class PosTestUI extends game.BaseUI {

    private static _instance: PosTestUI;
    public static getInstance(): PosTestUI {
        if(!this._instance)
            this._instance = new PosTestUI();
        return this._instance;
    }

    private topUI: TopUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private bottomUI: BottomUI;




    private testType
    private listData
    public constructor() {
        super();
        this.skinName = "PosTestUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);

        this.scroller.viewport = this.list;
        this.list.itemRenderer = PosTestItem
    }

    public show(v?,listData?){
        this.testType = v;
        this.listData = listData;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){

        this.renew();
        this.addPanelOpenEvent(GameEvent.client.pos_change,this.renew)
    }

    public test(chooseData){
        if(this.testType == 'atk')
            PKManager.getInstance().test(this.listData,chooseData)
        else
            PKManager.getInstance().test(chooseData,this.listData)
    }

    public renew(){
        var PM = PosManager.getInstance();
        if(this.testType == 'atk')
        {
            this.topUI.setTitle('请选择防守阵容')
            var arr = PM.defList.concat();
            for(var i=0;i<arr.length;i++)
            {
                arr[i] = {
                    data:arr[i],
                    type:'def'
                };
            }
        }
        else
        {
            this.topUI.setTitle('请选择进攻阵容')
            var arr = PM.atkList.concat();
            for(var i=0;i<arr.length;i++)
            {
                arr[i] = {
                    data:arr[i],
                    type:'atk'
                };
            }
        }

        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}