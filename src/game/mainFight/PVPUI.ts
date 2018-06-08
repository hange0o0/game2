class PVPUI extends game.BaseItem {

    private static _instance: PVPUI;
    public static getInstance(): PVPUI {
        if(!this._instance)
            this._instance = new PVPUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PVPUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this, this.onPvp)
    }

    private onPvp(){
        MyWindow.ShowTips('即将开放，敬请期待')
    }

    public renew(){

    }
}