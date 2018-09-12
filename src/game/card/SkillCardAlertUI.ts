class SkillCardAlertUI extends game.BaseWindow {

    private static _instance: SkillCardAlertUI;
    public static getInstance(): SkillCardAlertUI {
        if(!this._instance)
            this._instance = new SkillCardAlertUI();
        return this._instance;
    }

    private desText: eui.Label;
    private btnGroup: eui.Group;
    private okBtn: eui.Button;



    public index
    public constructor() {
        super();
        this.skinName = "SkillCardAlertUISkin";
        this.canBGClose = false;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
    }

    public onClick(){
       this.index++;
        if(this.index >= 3)
        {
            this.hide();
            return;
        }
        this.renew();
    }

    public show(v?){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.index = 0;
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var arr = ['战斗时会消耗法术卡牌！\n战斗时会消耗法术卡牌！\n战斗时会消耗法术卡牌！',
            '如果你战斗胜出，未使用的法术卡牌会被返还。',
            '如果你战斗失败，则本轮出战的所有法术卡牌都会被移除！'
        ]
        this.desText.text = arr[this.index];
    }
}
