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


    private currentActive

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
        PKActiveManager.getInstance().onPK(this.currentActive.type,()=>{

        })
    }

    private onReset(){
        PKActiveManager.getInstance().onReset(this.currentActive.type,()=>{

        })
    }

    private renewBar(num){
        for(var i=0;i<12;i++)
        {
            this['s'+i].fillColor = num>i?0xFF0000:0xFFF000
        }
    }

    public show(v?){
        this.currentActive = v;
        PKActiveManager.getInstance().getActiveInfo(this.currentActive.type,()=>{
            super.show();
        })

    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        var cd = this.currentActive.end - TM.now();
        if(cd > 3600*24)
            this.cdText.text = '活动结束：' + DateUtil.getStringBySeconds(cd,false,2)
        else
            this.cdText.text = '活动结束：' + DateUtil.getStringBySecond(cd)
    }

    private renew(){
        var faward = this.currentActive.faward
        if(faward == 'box')
        {
            this.finalAwardMC.source = MyTool.getPropBox(24)
        }
        else if(faward == 'skill')
        {
            this.finalAwardMC.source = MyTool.getSkillBox(2)
        }
        else if(faward == 'hero')
        {
            this.finalAwardMC.source = MyTool.getHeroBox(1)
        }
        var activeInfo;


        switch(this.currentActive.type)
        {
            case PKActiveManager.TYPE_FIGHT:
                activeInfo = FightManager.getInstance().getActiveInfo();
                break
            case PKActiveManager.TYPE_ANSWER:
                activeInfo = PKAnswerManager.getInstance().getActiveInfo();
                return

        }

        var winNum = activeInfo.index;
        var leftNum = activeInfo.num;
        var award = activeInfo.win_award;
        this.renewBar(winNum);
        this.list.dataProvider = new eui.ArrayCollection(award)
        if(winNum == 12)
        {
            this.currentState = 'finish'
        }
        else
        {
            this.currentState = 'normal'
            if(leftNum == 0)
            {
                this.resetGroup.visible = true
                this.pkBtn.visible = false
                this.desText.text = ''
                var base = PKActiveManager.getInstance().base[this.currentActive.type];
                this.diamondText.text = base.diamond
                this.resetBtn.label = base.label
            }
            else
            {
                this.resetGroup.visible = false
                this.pkBtn.visible = true
                if(this.currentActive.type == PKActiveManager.TYPE_FIGHT)
                    this.desText.text = '剩余卡牌：' + leftNum
                else
                    this.desText.text = '剩余次数：' + leftNum
            }
        }

        this.onTimer();
    }
}