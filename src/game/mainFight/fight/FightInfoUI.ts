class FightInfoUI extends game.BaseWindow {

    private static _instance:FightInfoUI;

    public static getInstance():FightInfoUI {
        if(!this._instance)
            this._instance = new FightInfoUI();
        return this._instance;
    }


    public constructor() {
        super();
        this.skinName = "FightInfoUISkin";
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

        this.list.itemRenderer = FightShopItem
    }

    private onClick(){
        PKBeforeUI.getInstance().show({
            stopAdd:true,
            title:'远程布阵',
            noTab:true,
            list:PKManager.getInstance().getDefaultPKList(),
            fun:function(data){
                console.log(data)
            }
        })
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