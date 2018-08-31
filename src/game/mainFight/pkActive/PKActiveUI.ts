class PKActiveUI extends game.BaseUI {

    private static _instance:PKActiveUI;

    public static getInstance():PKActiveUI {
        if (!this._instance)
            this._instance = new PKActiveUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKActiveUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }
}