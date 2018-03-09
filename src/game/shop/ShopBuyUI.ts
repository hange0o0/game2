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

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private text: eui.Label;
    private icon: eui.Image;
    private text0: eui.Label;

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
        this.setHtml(this.text, '确定花费'+this.createHtml(this.dataIn.diamond,0x79D7FC)+'钻石购买以下道具？');
        var name = ''
        if(this.dataIn.id == 'coin')
        {
            name = '金币'  + ' ×' + NumberUtil.formatStrNum(this.dataIn.num);
            this.icon.source = MyTool.getPropCoin()
        }
        else if(this.dataIn.id == 'energy')
        {
            name = '体力'  + ' ×' + NumberUtil.formatStrNum(this.dataIn.num);
            this.icon.source = MyTool.getPropEnergy()
        }
        else
        {
            var vo = PropVO.getObject(this.dataIn.id);
            name = vo.propname + ' ×' + this.dataIn.num;
            this.icon.source = vo.getThumb()

        }
        this.text0.text = name

    }

    private onClick(){
        PayManager.getInstance().buy_shop(this.dataIn.id,()=>{
            MyWindow.ShowTips('购买成功！')
            ShopUI.getInstance().renewList()
        })

        this.hide();
    }
}
