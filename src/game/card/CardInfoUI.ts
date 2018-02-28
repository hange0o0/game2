class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private upGroup: eui.Group;
    private coinText: eui.Label;
    private icon: eui.Image;
    private okBtn: eui.Button;
    private helpBtn: eui.Image;


    public data;
    public upAble = false;
    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('card')
        })
    }

    private onClick(){
        if(!this.upAble)
            return
        if(this.data.isMonster)
        {
            CardManager.getInstance().card_open(this.data.id,()=>{
                this.hide();
            })
        }
        else
        {
             CardManager.getInstance().card_buy(this.data.id,()=>{
                 this.hide();
             })
        }
    }

    public show(v?){
        this.data = v;
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
        var CM = CardManager.getInstance()
        var homeLevel = TecManager.getInstance().getLevel(1)
        this.upAble = true
        this.item.renew({
            mid:this.data.id,
            force:UM.tec_force,
            type:UM.type
        });

        if(this.data.isMonster)
        {
            if(CM.monsterList[this.data.id] || this.data.level > homeLevel)
            {
                MyTool.removeMC(this.upGroup);
            }
            else
            {
                this.btnGroup.addChild(this.upGroup)
                var coin = CM.getUpCoin(this.data.id);
                this.coinText.text = coin + ''
                this.upAble = coin <= UM.getCoin()
                this.okBtn.label = '解锁'
                this.okBtn.skinName = 'Btn1Skin'
            }
        }
        else
        {
            if(CM.skillList[this.data.id] || this.data.level > homeLevel)
            {
                MyTool.removeMC(this.upGroup);
            }
            else
            {
                this.btnGroup.addChild(this.upGroup)
                this.coinText.text = CM.skillCost + ''
                this.upAble =  CM.skillCost <= PropManager.getInstance().getNum(103)
                this.okBtn.label = '兑换'
                this.okBtn.skinName = 'Btn8Skin'
            }
        }
        this.coinText.textColor = this.upAble?0xFFFFFF:0xFF0000;
    }
}