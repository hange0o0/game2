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


    private dataIn;
    public constructor() {
        super();
        this.skinName = "AwardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.hide)
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
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var arr = [];
        if(this.dataIn.coin)
            arr.push({img:'icon_coin_png',name:'金币','num':'×' + NumberUtil.addNumSeparator(this.dataIn.coin)})
        for(var s in this.dataIn.props)
        {
            var prop =  PropVO.getObject(s);
            arr.push({img:prop.getThumb(),name:prop.propname,'num':'×' + NumberUtil.addNumSeparator(this.dataIn.props[s])})
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }
}