class CardDrawResultUI extends game.BaseWindow {

    private static _instance: CardDrawResultUI;
    public static getInstance(): CardDrawResultUI {
        if(!this._instance)
            this._instance = new CardDrawResultUI();
        return this._instance;
    }


    private desText: eui.Label;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private titleText: eui.Label;
    private btnGroup: eui.Group;
    private item: CardItem;



    private dataIn
    public constructor() {
        super();
        this.skinName = "CardDrawResultUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)
    }

    private onClick(){
         CardManager.getInstance().card_draw()
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
        this.desText.text = this.dataIn.addprop?'重复卡牌已被自动分解为碎片+1':'';
        this.item.data = SkillVO.getObject(this.dataIn.id);
        if(PropManager.getInstance().getNum(102))
        {
            this.btnGroup.addChild(this.okBtn)
        }
        else
        {
            MyTool.removeMC(this.okBtn)
        }
    }
}