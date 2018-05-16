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

    }

    private onClick(){

    }

    public show(){
        PayManager.getInstance().get_shop(()=>{
            super.show()
        })

    }

    public onShow(){
        this.renew()
    }

    private renew(){
        this.list.dataProvider = new eui.ArrayCollection(PayManager.getInstance().shopData)
    }

}