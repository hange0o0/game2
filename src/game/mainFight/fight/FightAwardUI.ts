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
        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelected,this)

    }

    private onSelected(){
        var items = this.list.selectedItems
        this.titleText.text = '选择增加手牌（'+items.length+'/5）'
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
            FightInfoUI.getInstance().changeCard();
        })
    }

    public show(){
        //PayManager.getInstance().get_shop(()=>{
            super.show()
        //})

    }

    public onShow(){
        this.renew()
    }

    private renew(){
        var award = FightManager.getInstance().award.split(',');
        this.list.dataProvider = new eui.ArrayCollection(award)
        this.list.selectedItems = null;
    }

}