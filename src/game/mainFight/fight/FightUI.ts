class FightUI extends game.BaseItem {

    private static _instance: FightUI;
    public static getInstance(): FightUI {
        if(!this._instance)
            this._instance = new FightUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FightUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public renew(){

    }
}