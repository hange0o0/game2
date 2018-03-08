class PKWinUI extends game.BaseUI {

    private static _instance:PKWinUI;
    public static getInstance():PKWinUI {
        if (!this._instance)
            this._instance = new PKWinUI();
        return this._instance;
    }

    private bg: eui.Rect;
    private group: eui.Group;
    private list: eui.List;
    private closeBtn: eui.Label;




    public constructor() {
        super();
         this.hideBehind = false
        this.skinName = "PKWinUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PKAwardItem
        this.addBtnEvent(this, this.onOK)
    }

    public onShow(){
        var PKM = PKManager.getInstance();

        this.bg.visible = false;
        if(GameManager.stage.stageHeight > 1050)
            this.group.y = 230 + 130
        else
            this.group.y = 180  + 130

        this.list.visible = this.closeBtn.visible = false
        this.group.scaleX = this.group.scaleY = 0;

        var arr = []
        if(PKM.pkResult && PKM.pkResult.award)
            arr = MyTool.getAwardArr(PKM.pkResult.award)
        var arrayCollection = this.list.dataProvider = new eui.ArrayCollection([]);


        var tw = egret.Tween.get(this.group)
        tw.to({scaleX:1.1,scaleY:1.1},200).to({scaleX:1,scaleY:1},200).call(function(){
            this.bg.visible = true;
            this.list.visible = true
        },this)
        while(arr.length > 0)
        {
            this.addItem(tw,arrayCollection,arr.shift())
        }

        tw.wait(300).call(function(){
            this.closeBtn.visible = true;
        },this)


    }

    private addItem(tw,arrayCollection,data){
        tw.wait(150).call(function(){
            arrayCollection.addItem(data)
        },this)
    }

    private onOK(){
        if(!this.closeBtn.visible)
            return;
        this.hide();
        PKingUI.getInstance().hide();
    }
}