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
    private titleText: eui.Label;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private desText: eui.Label;



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
         this.renew();
    }

    private renew(){
        this.shopItem.data = this.dataIn;
        if(!this.dataIn.times)
            this.titleText.text = '首次购买'
        else
            this.titleText.text = '第'+(this.dataIn.times + 1)+'次购买'

        if(this.dataIn.id == 101){
             this.currentState = 'des'
            this.desText.text = '这个'+PropVO.getObject(101).propname+'会在战役第'+this.dataIn.level+'关掉落，是否花费'+PayManager.getInstance().getShopDiamond(this.dataIn)+'钻石提前获得？'
        }
        else {
             this.currentState = 'normal'
        }
    }

    private onClick(){
        if(UM.diamond < PayManager.getInstance().getShopDiamond(this.dataIn))
        {
            MyWindow.ShowTips('钻石不足！')
            return;
        }


        PayManager.getInstance().buy_shop(this.dataIn.key,()=>{
            //MyWindow.ShowTips('购买成功！')
            ShopUI.getInstance().renewList()
            this.hide();
        })

        //this.hide();
    }
}
