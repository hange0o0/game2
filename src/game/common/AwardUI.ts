class AwardUI extends game.BaseWindow {

    private static _instance: AwardUI;
    public static getInstance(): AwardUI {
        if(!this._instance)
            this._instance = new AwardUI();
        return this._instance;
    }

    private okBtn: eui.Button;
    private list: eui.List;
    private titleText: eui.Label;
    private desText: eui.Label;



    private dataIn;
    private title;
    private des;
    private fun;
    public constructor() {
        super();
        this.skinName = "AwardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.hide)
    }

    public show(v?,title?,des?,fun?){
        if(!v)
            return;
        this.dataIn = v;
        this.title = title;
        this.des = des;
        this.fun = fun;
        super.show()
    }

    public hide() {
        super.hide();
        this.fun && this.fun();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        this.titleText.text = this.title || '恭喜获得'
        var arr = MyTool.getAwardArr(this.dataIn);
        this.list.dataProvider = new eui.ArrayCollection(arr);
        if(this.des)
        {
            this.currentState = 'des'
            this.desText.text = this.des;
        }
        else
        {
            this.currentState = 'normal'
        }
    }
}