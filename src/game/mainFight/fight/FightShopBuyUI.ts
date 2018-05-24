class FightShopBuyUI extends game.BaseWindow {
    private static _instance: FightShopBuyUI;
    public static getInstance(): FightShopBuyUI {
        if(!this._instance)
            this._instance = new FightShopBuyUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FightShopBuyUISkin";
    }

    private shopItem: FightShopItem;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;


    private dataIn

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onClick);
    }

    public show(v?){
        this.dataIn = v;
        super.show();
    }

    public onShow(){
       this.shopItem.data = this.dataIn;
    }

    private onClick(){
        if(FightManager.getInstance().value < this.dataIn.diamond)
        {
            MyWindow.ShowTips('远征点不足！')
            return;
        }
        PayManager.getInstance().buy_shop(this.dataIn.id,()=>{
            MyWindow.ShowTips('购买成功！')
            ShopUI.getInstance().renewList()
        })

        this.hide();
    }
}
