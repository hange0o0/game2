class PKAnswerUI extends game.BaseUI {

    private static _instance:PKAnswerUI;

    public static getInstance():PKAnswerUI {
        if (!this._instance)
            this._instance = new PKAnswerUI();
        return this._instance;
    }

    private titleText: eui.Label;
    private list1: eui.List;
    private list2: eui.List;
    private btn: eui.Button;



    public constructor() {
        super();
        this.skinName = "PKAnswerUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }
}