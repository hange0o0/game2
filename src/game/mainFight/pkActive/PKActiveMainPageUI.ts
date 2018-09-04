class PKActiveMainPageUI extends game.BaseItem {

    private static _instance:PKActiveMainPageUI;
    public static getInstance():PKActiveMainPageUI {
        if (!this._instance)
            this._instance = new PKActiveMainPageUI();
        return this._instance;
    }

    private bg: eui.Image;
    private lockText: eui.Label;
    private pvpBtn: eui.Image;
    private activeBtn: eui.Group;
    private cdText: eui.Label;



    public constructor() {
        super();
        this.skinName = "PKActiveMainPageUISkin";
        PKActiveMainPageUI._instance = this;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.activeBtn,this.onActive)
        this.addBtnEvent(this.pvpBtn,this.onPVP)

        egret
    }

    public resetHeight(h){
        this.height = h;
    }

    private onActive(){

    }
    private onPVP(){

    }

    public dataChanged(){

    }
}