class FightAwardUI extends game.BaseWindow {

    private static _instance:FightAwardUI;

    public static getInstance():FightAwardUI {
        if(!this._instance)
            this._instance = new FightAwardUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FightAwardUISkin";
    }

    private list: eui.List;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private titleText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)

        this.list.allowMultipleSelection = true
        this.list.itemRenderer = FightAwardItem

        this.list.addEventListener(egret.Event.CHANGE,this.onSelected,this)
        this.list.addEventListener(egret.Event.CHANGING,this.onTapChanging,this)

    }

    private onTapChanging(e){
        if(this.getSelectNum() > 5)
        {
            e.preventDefault();
            MyWindow.ShowTips('不能选择多于5张卡牌')
        }
        //console.log(this.scrolllist.list.selectedIndices)
    }

    private onSelected(){
        this.titleText.text = '选择增加手牌（'+this.getSelectNum()+'/5）'
        this.renewList();
    }

    public getSelectNum(){
        return this.list.selectedItems.length;
    }

    private onClick(){
        var items = this.list.selectedItems
        if(items.length < 5)
        {
            MyWindow.ShowTips('需选择5张卡牌加入你的手牌')
            return
        }
        if(items.length > 5)
        {
            MyWindow.ShowTips('不能选择多于5张卡牌')
            return
        }
        FightManager.getInstance().getAward(items,()=>{
            this.hide();
            //FightInfoUI.getInstance().changeCard();
        })
    }

    public show(){
        if(!FightManager.getInstance().award)
            return;
        if(PKActiveManager.getInstance().getCurrentActive().type != PKActiveManager.TYPE_FIGHT)
            return;
        //PayManager.getInstance().get_shop(()=>{
            super.show()
        //})

    }

    public onShow(){
        this.renew()
        this.addPanelOpenEvent(GameEvent.client.active_end,this.hide)
    }

    private renewList(){
        MyTool.renewList(this.list);
    }

    private renew(){
        this.titleText.text = '选择增加手牌（0/5）'
        var award = FightManager.getInstance().award.split(',');
        this.list.dataProvider = new eui.ArrayCollection(award)
        this.list.selectedItems = null;
    }

}