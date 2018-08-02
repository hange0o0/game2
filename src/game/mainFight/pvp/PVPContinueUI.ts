class PVPContinueUI extends game.BaseWindow {

    private static _instance:PVPContinueUI;

    public static getInstance():PVPContinueUI {
        if (!this._instance)
            this._instance = new PVPContinueUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PVPContinueUISkin";
    }

    private list: eui.List;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private hpText: eui.Label;
    private lvIcon: eui.Image;
    private lvText: eui.Label;
    private headMC: HeadMC;
    private cancelBtn: eui.Button;
    private pkBtn: eui.Button;


    private dataArray = new eui.ArrayCollection()
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn, this.pkBtn)
        this.addBtnEvent(this.cancelBtn, this.onClose)

        this.list.itemRenderer = PosListHeadItem
        this.list.dataProvider = this.dataArray
    }

    private onClose(){

    }

    private onClose(){

    }
}