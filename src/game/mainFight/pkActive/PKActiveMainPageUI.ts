class PKActiveMainPageUI extends game.BaseItem {

    private static _instance:PKActiveMainPageUI;
    public static getInstance():PKActiveMainPageUI {
        if (!this._instance)
            this._instance = new PKActiveMainPageUI();
        return this._instance;
    }

    private bg: eui.Image;
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
    }

    public dataChanged(){

    }
}