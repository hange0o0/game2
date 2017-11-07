class PKFailUI extends game.BaseWindow {

    private static _instance:PKFailUI;
    public static getInstance():PKFailUI {
        if (!this._instance)
            this._instance = new PKFailUI();
        return this._instance;
    }

    private okBtn: eui.Label;
    private retryBtn: eui.Label;

    public constructor() {
        super();

        this.skinName = "PKFailUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn, this.onOK)
        this.addBtnEvent(this.retryBtn, this.onRetry)
    }

    private onOK(){
        this.hide();
        PKingUI.getInstance().hide();
    }

    private onRetry(){
        PKingUI.getInstance().hide();
        this.hide();
        PKManager.getInstance().startPlay();

    }
}