class PKActiveUI extends game.BaseUI {

    private static _instance:PKActiveUI;

    public static getInstance():PKActiveUI {
        if (!this._instance)
            this._instance = new PKActiveUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private finalAwardMC: eui.Image;
    private list: eui.List;
    private titleText: eui.Label;
    private desText: eui.Label;
    private pkBtn: eui.Button;
    private s0: eui.Rect;
    private s1: eui.Rect;
    private s2: eui.Rect;
    private s3: eui.Rect;
    private s4: eui.Rect;
    private s5: eui.Rect;
    private s6: eui.Rect;
    private s7: eui.Rect;
    private s8: eui.Rect;
    private s9: eui.Rect;
    private s10: eui.Rect;
    private s11: eui.Rect;
    private resetGroup: eui.Group;
    private resetBtn: eui.Button;
    private diamondText: eui.Label;
    private cdText: eui.Label;




    public constructor() {
        super();
        this.skinName = "PKActiveUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('消息')

        this.list.itemRenderer = PKActiveItem;
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.resetBtn,this.onReset)
        this.titleText.text = '完成本关可得奖励'
    }

    private onPK(){

    }

    private onReset(){

    }

    private renewBar(){
        var num = 10;
        for(var i=0;i<12;i++)
        {
            this['s'+i].fillColor = num>i?0xFF0000:0xFFF000
        }
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        this.cdText.text = ''
    }

    private renew(){
        this.onTimer();
        this.renewBar();

        var data
        if(data.box)
        {
            this.finalAwardMC.source = MyTool.getPropBox(data.box)
        }
        else if(data.skill)
        {
            this.finalAwardMC.source = MyTool.getSkillBox(data.skill)
        }
        else if(data.hero)
        {
            this.finalAwardMC.source = MyTool.getHeroBox(data.hero)
        }

        var winNum = 0;
        var leftNum = 0;
        this.list.dataProvider = new eui.ArrayCollection(data.list)

        if(winNum == 12)
        {
            this.currentState = 'finish'
        }
        else
        {
            this.currentState = 'normal'
        }


    }
}