class PKChooseCardUI extends game.BaseWindow {

    private static _instance:PKChooseCardUI;

    public static getInstance():PKChooseCardUI {
        if (!this._instance)
            this._instance = new PKChooseCardUI();
        return this._instance;
    }

    private list: eui.List;
    private btnGroup: eui.Group;
    private cancelBtn: eui.Button;
    private titleText: eui.Label;




    public constructor() {
        super();
        this.skinName = "PKChooseCardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PKChooseCardItem
        this.addBtnEvent(this.cancelBtn,this.hide)
    }

    public onShow(){
        this.addPanelOpenEvent(GameEvent.client.active_end,this.hide)
    }

    private renew(){
        var PCM = PKChooseCardManager.getInstance();
        var num = PCM.info.cardlist.split(',').length;
        this.titleText.text = '选择一个加入手牌('+num+'/'+PCM.maxNum+')'
        this.list.dataProvider = new eui.ArrayCollection(PCM.info.choose)
    }

}