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
    private successMVID = 128
    private failMVID = 28
    public constructor() {
        super();
        this.skinName = "CardDrawResultUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)
        AniManager.getInstance().preLoadMV(this.successMVID)
        AniManager.getInstance().preLoadMV(this.failMVID)
    }

    private onClick(){
        if(!this.desText.visible)
            return;
        this.desText.text = ''
        this.item.scaleX = this.item.scaleY = 0;
        CardManager.getInstance().card_draw()
    }

    public show(v?){
        this.dataIn = v;
        this.noMV = this.stage && this.visible;
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
        this.desText.text = this.dataIn.addprop?'已拥有卡牌已被自动分解\n'+PropVO.getObject(103).propname+':+1':'获得新的卡片';
        this.item.data = SkillVO.getObject(this.dataIn.id);
        if(PropManager.getInstance().getNum(102))
        {
            this.btnGroup.addChild(this.okBtn)
        }
        else
        {
            MyTool.removeMC(this.okBtn)
        }
        if(this.noMV)
        {
            this.desText.visible = false;
            this.item.scaleX = this.item.scaleY = 0;
            egret.Tween.get(this.item).to({scaleX:1.2,scaleY:1.2},150).to({scaleX:1,scaleY:1},200).call(()=>{
                this.desText.visible = true;
            },this)
        }
        else
        {
            this.desText.visible = true;
            this.item.scaleX = this.item.scaleY = 1;
        }
        var xy={x:240,y:210}
        var AM = AniManager.getInstance();
        if(this.dataIn.addprop)
        {
            var mv =  AM.playOnItem(this.failMVID,this.item,xy);
            this.desText.textColor = 0xFF9393
        }
        else
        {
            var mv =  AM.playOnItem(this.successMVID,this.item,xy);
            this.desText.textColor = 0x93FF93
        }
    }
}