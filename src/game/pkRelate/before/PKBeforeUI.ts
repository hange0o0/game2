class PKBeforeUI extends game.BaseWindow {

    private static _instance: PKBeforeUI;
    public static getInstance(): PKBeforeUI {
        if(!this._instance)
            this._instance = new PKBeforeUI();
        return this._instance;
    }

    private scrollerBG: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;
    private startBtn: eui.Button;
    private rightBtn: eui.Image;
    private leftBtn: eui.Image;
    private closeBtn: eui.Image;
    private nameText: eui.Label;



    public index
    public dataIn
    public constructor() {
        super();
        this.skinName = "PKBeforeUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)
        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.startBtn,this.onStart)
        this.addBtnEvent(this.list,this.onListClick)

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)

        this.scroller.viewport = this.list;
        this.list.itemRenderer = AtkPosItem;
        this.list.touchChildren = false;
    }

    private onScroll(){
        this.scrollerBG.y = this.scroller.y - this.scroller.viewport.scrollV*0.9;
    }

    private onListClick(){
        AtkPosUI.getInstance().show(this.index)
    }

    private onStart(){
        var PM = PosManager.getInstance();
        var data = PM.atkList[this.index];
        if(!data)
        {
            Alert('还没设置出战卡组',()=>{
                this.onListClick();
            })
            return;
        }
    }

    private onLeft(){
        var PM = PosManager.getInstance();
        this.index --;
        if(this.index < 0)
        {
            this.index = Math.min(PM.maxNum-1,PM.atkList.length)
        }
        this.renew();
    }

    private onRight(){
        var PM = PosManager.getInstance();
        this.index ++;
        var max = Math.min(PM.maxNum-1,PM.atkList.length)
        if(this.index > max)
            this.index = 0;
        this.renew();
    }

    public show(dataIn?){
        this.dataIn = dataIn;

        this.index = SharedObjectManager.getInstance().getMyValue('pk_choose') || 0
        var PM = PosManager.getInstance();
        if(this.index >= PM.atkList.length)
            this.index = 0;


        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.titleText.text = this.dataIn.name;
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var PM = PosManager.getInstance();
        var data = PM.atkList[this.index];
        if(data)
        {
            this.scrollerBG.visible = false
            this.nameText.text = '新建阵容'
        }
        else
        {
            this.scrollerBG.visible = true
            this.nameText.text = data.name;
            this.list.dataProvider = new eui.ArrayCollection(data.list);
        }

    }
}