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
    private scroller: eui.Scroller;
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
    private awardBox: eui.Image;
    private awardBtn: eui.Button;
    private boxText: eui.Label;
    private resetGroup: eui.Group;
    private resetBtn: eui.Button;
    private diamondText: eui.Label;
    private cdText: eui.Label;





    private currentActive
    private activeInfo

    public constructor() {
        super();
        this.skinName = "PKActiveUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);


        this.scroller.viewport = this.list;
        this.list.itemRenderer = PKActiveItem;
        this.addBtnEvent(this.pkBtn,this.onPK)
        this.addBtnEvent(this.resetBtn,this.onReset)
        this.addBtnEvent(this.finalAwardMC,this.onTips)
        this.addBtnEvent(this.awardBtn,this.onGetAward)

    }

    private onTips(){
        if(this.currentActive.faward == 'box')
            MyWindow.ShowTips(24 + '小时资源宝箱，完成所有挑战后可领取')
        else if(this.currentActive.faward == 'hero')
            MyWindow.ShowTips(1 + '级英雄宝箱，完成所有挑战后可领取')
        else if(this.currentActive.faward == 'skill')
            MyWindow.ShowTips(2 + '级技能宝箱，完成所有挑战后可领取')
    }

    private onGetAward(){
        PKActiveManager.getInstance().onAward(this.currentActive.type,()=>{

        })
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
            this['s'+i].fillColor = num>i?0xFFC360:0x512B00
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
        this.addPanelOpenEvent(GameEvent.client.active_change,this.renew)
    }

    private onTimer(){
        var cd = this.currentActive.end - TM.now();
        if(cd<=0)
        {
            EM.dispatch(GameEvent.client.active_end)
            this.hide();
            return;
        }
        if(cd > 3600*24)
            this.cdText.text = '活动结束：' + DateUtil.getStringBySeconds(cd,false,2)
        else
            this.cdText.text = '活动结束：' + DateUtil.getStringBySecond(cd)
    }

    private renew(){
        var base = PKActiveManager.getInstance().base[this.currentActive.type];
        this.topUI.setTitle(base.title,base.helpKey)
        this.pkBtn.label = '挑  战'

        var faward = this.currentActive.faward
        if(faward == 'box')
        {
            this.finalAwardMC.source = MyTool.getPropBox(24)
            this.boxText.text = 24 + '小时资源宝箱'
        }
        else if(faward == 'skill')
        {
            this.finalAwardMC.source = MyTool.getSkillBox(2)
            this.boxText.text = 2 + '级技能宝箱'
        }
        else if(faward == 'hero')
        {
            this.finalAwardMC.source = MyTool.getHeroBox(1)
            this.boxText.text = 1 + '级英雄宝箱'

        }
        var activeInfo;


        switch(this.currentActive.type)
        {
            case PKActiveManager.TYPE_FIGHT:
                activeInfo = FightManager.getInstance().getActiveInfo();
                break
            case PKActiveManager.TYPE_ANSWER:
                activeInfo = PKAnswerManager.getInstance().getActiveInfo();
                break
            case PKActiveManager.TYPE_RANDOM:
                activeInfo = PKRandomManager.getInstance().getActiveInfo();
                break
            case PKActiveManager.TYPE_CHOOSE:
                activeInfo = PKChooseCardManager.getInstance().getActiveInfo();
                if(PKChooseCardManager.getInstance().info.choose)
                {
                    this.pkBtn.label = '选  卡'
                }
                break
            case PKActiveManager.TYPE_ENDLESS:
                activeInfo = PKEndLessManager.getInstance().getActiveInfo();
                break
        }

        var winNum = activeInfo.index;
        var leftNum = activeInfo.num;
        var award = activeInfo.win_award;
        this.renewBar(winNum);
        if(award.length == 1)
            this.list.layout['requestedColumnCount'] = 1
        else if(award.length == 2)
            this.list.layout['requestedColumnCount'] = 2
        else
            this.list.layout['requestedColumnCount'] = 3

        this.list.dataProvider = new eui.ArrayCollection(award)
        if(winNum == 12)
        {
            this.awardBox.source = this.finalAwardMC.source;
            if(activeInfo.haveAward)
            {
                this.currentState = 'awarded'
                this.titleText.text = '副本已完成'
            }
            else
            {
                this.currentState = 'award'
                this.titleText.text = '获取终极大奖'
            }
        }
        else
        {
            this.titleText.text = '第 '+(winNum + 1)+' 关'
            this.currentState = 'normal'
            if(leftNum == 0)
            {
                if(this.currentActive.type == PKActiveManager.TYPE_FIGHT && (!activeInfo.init || FightManager.getInstance().award))
                {
                    this.resetGroup.visible = false
                    this.pkBtn.visible = true
                    this.desText.text = ''
                    if(!activeInfo.init)
                        this.pkBtn.label = '初始卡牌'
                    else
                        this.pkBtn.label = '选择卡牌'
                }
                else
                {
                    this.resetGroup.visible = true
                    this.pkBtn.visible = false
                    this.desText.text = ''

                    this.diamondText.text = base.diamond
                    this.resetBtn.label = base.label
                }
            }
            else
            {
                this.resetGroup.visible = false
                this.pkBtn.visible = true
                if(this.currentActive.type == PKActiveManager.TYPE_FIGHT)
                    this.desText.text = '剩余卡牌：' + leftNum
                else
                    this.desText.text = '剩余挑战次数：' + leftNum
            }
        }

        this.activeInfo = activeInfo;
        this.onTimer();
    }
}