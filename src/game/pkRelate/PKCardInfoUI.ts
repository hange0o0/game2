class PKCardInfoUI extends game.BaseContainer {

    private static _instance: PKCardInfoUI;
    public static getInstance(): PKCardInfoUI {
        if(!this._instance)
            this._instance = new PKCardInfoUI();
        return this._instance;
    }

    private type: eui.Image;
    private nameText: eui.Label;
    private cardGroup: eui.Group;
    private bg: eui.Image;
    private img: CardImg;
    private desText: eui.Label;
    private list1: eui.List;
    private list2: eui.List;


    public dataIn

    private stageX
    private stageY
    public constructor() {
        super();
        this.skinName = "PKCardInfoSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.list1.itemRenderer = PKCardInfoItem
        this.list2.itemRenderer = PKCardInfoItem
    }


    public show(v){
        this.dataIn = v;
        GameManager.container.addChild(this);
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this,true);
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        this.stageX = GameManager.stageX
        this.stageY = GameManager.stageY
        var w = 480
        this.x = Math.min(Math.max(GameManager.stageX - w/2,0),640-w)
        if(GameManager.stageY < 400)
        {
            this.bottom = undefined
            this.top = GameManager.stageY + 50
        }
        else
        {
            this.top = undefined
            this.bottom = (GameManager.stage.stageHeight - GameManager.stageY) + 50
        }
        this.renew();
    }

    private onMove(e){
         if(Math.abs(this.stageX - e.stageX) > 20 || Math.abs(this.stageY - e.stageY) > 20)
            this.hide();
    }

    public hide() {
        game.BaseUI.setStopEevent();
        GameManager.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        MyTool.removeMC(this)
    }


    public renew(){
        var vo = CM.getCardVO(this.dataIn.mid)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
        this.nameText.text = vo.name;
        this.desText.text = vo.getDes();
    }
}