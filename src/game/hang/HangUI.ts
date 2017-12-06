class HangUI extends game.BaseWindow {

    private static _instance: HangUI;
    public static getInstance(): HangUI {
        if(!this._instance)
            this._instance = new HangUI();
        return this._instance;
    }

    private cancelBtn: eui.Button;
    private pKBtn: eui.Button;
    private awardBtn: eui.Button;
    private con: eui.Group;
    private img: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private timeText: eui.Label;




    public constructor() {
        super();
        this.skinName = "HangUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.pKBtn,this.onPK)
        this.addBtnEvent(this.awardBtn,this.onAward)

        this.con.mask = new egret.Rectangle(this.con.width,this.con.height)

        this.scroller.viewport = this.list
        this.list.itemRenderer = HangItem;
    }

    public onPK(){
        PKBeforeUI.getInstance().show({
            title:'挂机PK',
            fun:function(id){
                HangManager.getInstance().pk(id)
            }
        })
    }

    public onAward(){

    }

    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        this.timeText.text = DateUtil.getStringBySecond(356)
    }

    public renew(){
        this.img.source = PKManager.getInstance().getPKBG(_get['map']);
    }

    public showFight(){

    }
}