class SlaveChooseUI extends game.BaseWindow {

    private static _instance: SlaveChooseUI;
    public static getInstance(): SlaveChooseUI {
        if(!this._instance)
            this._instance = new SlaveChooseUI();
        return this._instance;
    }

    private list: eui.List;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private emptyGroup: eui.Group;
    private emptyText: eui.Label;
    private rankBtn: eui.Button;




    private lastCD = 0
    public constructor() {
        super();
        this.skinName = "SlaveChooseUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = SlaveChooseItem;
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.rankBtn,()=>{
            RankUI.getInstance().show();
            this.hide();
        })
    }

    private onClick(){
        if(this.lastCD)
            return;
        SlaveManager.getInstance().slave_miss(()=>{
            this.lastCD = TM.now();
            this.renew();
        })
    }

    public show(){
        if(this.lastCD)
        {
            super.show();
            return;
        }

        SlaveManager.getInstance().slave_miss(()=>{
            this.lastCD = TM.now();
            super.show();
        })
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        if(!this.lastCD)
            return;
         var cd = this.lastCD + 60 - TM.now()
        if(cd > 0)
        {
            this.okBtn.skinName = 'Btn3Skin'
            this.okBtn.label = cd + 's'
        }
        else
        {
            this.lastCD = 0;
            this.okBtn.skinName = 'Btn1Skin'
            this.okBtn.label = '重新搜索'
        }
    }

    public renew(){
        var SM =  SlaveManager.getInstance()
        var arr = SM.missList;
        //this.list.layout['requestedColumnCount'] = arr.length > 3?2:1
        this.list.dataProvider = new eui.ArrayCollection(arr)
        this.emptyGroup.visible = arr.length == 0.
        this.onTimer();
    }
}