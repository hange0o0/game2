class FightUI extends game.BaseItem {

    private static _instance: FightUI;
    public static getInstance(): FightUI {
        if(!this._instance)
            this._instance = new FightUI();
        return this._instance;
    }

    private lockGroup: eui.Group;
    private desText: eui.Label;


    public constructor() {
        super();
        this.skinName = "FightUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this, this.onFight)
        this.desText.text = '战役'+Config.fightLevel+' 解锁'
    }

    private onFight(){
        if(this.lockGroup.visible)
        {
            MyWindow.ShowTips(this.desText.text);
            return;
        }
        //FightInfoUI.getInstance().show();
    }

    public renew(){
        this.lockGroup.visible = HangManager.getInstance().level < Config.fightLevel

    }
}