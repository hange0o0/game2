class PVPUI extends game.BaseItem {

    private static _instance: PVPUI;
    public static getInstance(): PVPUI {
        if(!this._instance)
            this._instance = new PVPUI();
        return this._instance;
    }

    private lockGroup: eui.Group;
    private desText: eui.Label;


    public constructor() {
        super();
        this.skinName = "PVPUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this, this.onPvp)
        this.desText.text = '战役'+Config.pvpLevel+' 解锁'
    }

    private onPvp(){
        if(this.lockGroup.visible)
        {
            MyWindow.ShowTips(this.desText.text);
            return;
        }
        PVPInfoUI.getInstance().show();
    }

    public renew(){
        this.lockGroup.visible = HangManager.getInstance().level < Config.pvpLevel;

    }
}