class ShopBuyUI extends game.BaseWindow {
    private static _instance: ShopBuyUI;
    public static getInstance(): ShopBuyUI {
        if(!this._instance)
            this._instance = new ShopBuyUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "ShopBuyUISkin";
    }

    private shopItem: ShopItem;
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
        if(UM.diamond < PayManager.getInstance().getShopDiamond(this.dataIn))
        {
            MyWindow.ShowTips('钻石不足！')
            return;
        }

        PayManager.getInstance().buy_shop(this.dataIn.id,()=>{
            MyWindow.ShowTips('购买成功！')
            ShopUI.getInstance().renewList()
        })

        this.hide();
    }
}
