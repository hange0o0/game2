class PVPInfoUI extends game.BaseWindow {

    private static _instance:PVPInfoUI;

    public static getInstance():PVPInfoUI {
        if (!this._instance)
            this._instance = new PVPInfoUI();
        return this._instance;
    }


    public constructor() {
        super();
        this.skinName = "PVPInfoUISkin";
    }

    private list:eui.List;
    private stepText:eui.Label;
    private cardText:eui.Label;
    private numText:eui.Label;
    private okBtn:eui.Button;
    private cancelBtn:eui.Button;
    private cdText:eui.Label;
    private valueText:eui.Label;
    private helpBtn:eui.Image;


    private getNextData = false

    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.okBtn, this.onClick)
        //this.addBtnEvent(this.cancelBtn, this.onCancel)
        //this.addBtnEvent(this.helpBtn, this.onHelp)

        this.touchEnabled = false;

        this.list.itemRenderer = FightShopItem
    }
}