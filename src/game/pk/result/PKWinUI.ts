class PKWinUI extends game.BaseWindow {

    private static _instance:PKWinUI;
    public static getInstance():PKWinUI {
        if (!this._instance)
            this._instance = new PKWinUI();
        return this._instance;
    }

    private okBtn: eui.Label;

    public constructor() {
        super();

        this.skinName = "PKWinUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onOK)
    }

    private onOK(){
        this.hide();
        PKingUI.getInstance().hide();
    }
}