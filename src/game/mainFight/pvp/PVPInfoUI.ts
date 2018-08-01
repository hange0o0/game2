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

    private icon1: eui.Image;
    private titleGroup1: eui.Group;
    private titleText1: eui.Label;
    private pkBtn1: eui.Button;
    private expGroup1: eui.Group;
    private barMC1: eui.Rect;
    private rateText1: eui.Label;
    private icon0: eui.Image;
    private titleGroup0: eui.Group;
    private titleText0: eui.Label;
    private pkBtn0: eui.Button;
    private expGroup0: eui.Group;
    private barMC0: eui.Rect;
    private rateText0: eui.Label;
    private helpBtn: eui.Image;
    private awardList: eui.List;
    private cdText: eui.Label;



    private getNextData = false

    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.okBtn, this.onClick)
        //this.addBtnEvent(this.cancelBtn, this.onCancel)
        //this.addBtnEvent(this.helpBtn, this.onHelp)

        this.touchEnabled = false;
    }
}