class PKWinUI extends game.BaseWindow {

    private static _instance:PKWinUI;
    public static getInstance():PKWinUI {
        if (!this._instance)
            this._instance = new PKWinUI();
        return this._instance;
    }

    private list: eui.List;


    public constructor() {
        super();

        this.skinName = "PKWinUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this, this.onOK)
    }

    private onOK(){
        this.hide();
        PKingUI.getInstance().hide();
    }
}