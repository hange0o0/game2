class PKBeforeUI extends game.BaseWindow {

    private static _instance: PKBeforeUI;
    public static getInstance(): PKBeforeUI {
        if(!this._instance)
            this._instance = new PKBeforeUI();
        return this._instance;
    }

    private emptyMC: eui.Group;
    private scrollerBG: eui.Group;
    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;
    private rightBtn: eui.Image;
    private leftBtn: eui.Image;
    private closeBtn: eui.Button;
    private startBtn: eui.Button;
    private changeBtn: eui.Button;





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
        this.addBtnEvent(this.changeBtn,this.onListClick)

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)

        this.scroller.viewport = this.list;
        this.list.itemRenderer = BasePosItem;
        //this.list.touchChildren = false;

        //this.changeBtn.scrollRect = new egret.Rectangle(0,0,50,50)
    }

    private onScroll(){
        this.scrollerBG.scrollRect = new egret.Rectangle(0,this.scroller.viewport.scrollV,640,600)
        //this.scrollerBG.scrollRect = new egret.Rectangle(0,0,50,50)
        //console.log(this.scrollerBG.scrollRect)
        //this.scrollerBG.y = this.scroller.y - this.scroller.viewport.scrollV*0.9;
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
        this.dataIn.fun && this.dataIn.fun(data.id);
    }

    private onLeft(){
        var PM = PosManager.getInstance();

        if(this.index > 0)
        {
            this.index --;
            this.renew();
        }

    }

    private onRight(){
        var PM = PosManager.getInstance();

        var max = Math.min(PM.maxNum-1,PM.atkList.length)
        if(this.index < max)
        {
            this.index ++;
            this.renew();
        }

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

        this.renew();
        this.once(egret.Event.ENTER_FRAME,this.onScroll,this)
        this.addPanelOpenEvent(GameEvent.client.pos_change,this.renew)
    }

    public renew(){
        var PM = PosManager.getInstance();
        var data = PM.atkList[this.index];
        if(!data)
        {
            this.scroller.viewport.scrollV = 0
            this.onScroll()
            this.scroller.visible = false
            this.emptyMC.visible = true
            //this.titleText.text = this.dataIn.title;
            this.titleText.text = '新建阵容'
            this.changeBtn.label = '新建阵容'

        }
        else
        {
            this.scroller.visible = true
            this.emptyMC.visible = false
            this.titleText.text = Base64.decode(data.name);
            var arr = [];
            var list = data.list.split(',')
            for(var i=0;i<list.length;i++)
            {
                var id = list[i];
                arr.push({id:id})
            }
            this.list.dataProvider = new eui.ArrayCollection(arr);
            this.changeBtn.label = '调整阵容'
        }
        this.onScroll();

        var max = Math.min(PM.maxNum-1,PM.atkList.length)
        MyTool.changeGray(this.leftBtn,this.index == 0,true)
        MyTool.changeGray(this.rightBtn,this.index == max,true)

    }
}