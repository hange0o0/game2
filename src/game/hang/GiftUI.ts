class GiftUI extends game.BaseWindow {

    private static _instance: GiftUI;
    public static getInstance(): GiftUI {
        if(!this._instance)
            this._instance = new GiftUI();
        return this._instance;
    }

    private desText: eui.Label;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private list: eui.List;




    public dataIn
    public constructor() {
        super();
        this.skinName = "GiftUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    public onClick(){
        HangManager.getInstance().getGift(()=>{
            this.hide();
        })
    }

    public show(v?){
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
        this.dataIn = HangManager.getInstance().giftnum + 1;
        var propNum = TecManager.getInstance().getOtherNeed(this.dataIn,1)*2
        var awardData = {
            coin: TecManager.getInstance().getCoinNeed(this.dataIn)*15,
            props:{
                1:propNum,
                2:propNum,
                3:propNum
            }
        }
        var arr = MyTool.getAwardArr(awardData);
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }
}
