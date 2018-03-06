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
        var arr = []
        if(this.testType == 'atk')
        {
            this.topUI.setTitle('请选择防守阵容')
            for(var s in PM.defList)
            {
                arr.push({
                    data:PM.defList[s],
                    name:'防守阵容【' + (parseInt(s)+1)+ '】',
                    type:'def'
                });
            }
        }
        else
        {
            this.topUI.setTitle('请选择进攻阵容')
            for(var s in PM.atkList)
            {
                arr.push({
                    data:PM.atkList[s],
                    name:'进攻阵容【' + (parseInt(s)+1)+ '】',
                    type:'atk'
                });
            }
        }

        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}