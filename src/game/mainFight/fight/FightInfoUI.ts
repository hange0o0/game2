class FightInfoUI extends game.BaseWindow {

    private static _instance:FightInfoUI;

    public static getInstance():FightInfoUI {
        if(!this._instance)
            this._instance = new FightInfoUI();
        return this._instance;
    }


    public constructor() {
        super();
        this.skinName = "FightInfoUISkin";
    }

    private list: eui.List;
    private okBtn: eui.Button;
    private cancelBtn: eui.Button;
    private cdText: eui.Label;
    private valueText: eui.Label;
    private stepText: eui.Label;
    private cardText: eui.Label;
    private numText: eui.Label;


    private getNextData = false
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)

        this.list.itemRenderer = FightShopItem
    }

    private onClick(){
        var FM = FightManager.getInstance();
        if(FM.award)
        {
            FightAwardUI.getInstance().show();
        }
        else if(FM.card)
        {
            PKBeforeUI.getInstance().show({
                stopAdd:true,
                title:'调整阵容',
                noTab:true,
                list:FM.card.join(','),
                fun:function(data){
                    FM.changePos(data,()=>{
                        FM.pk()
                        })
                },
                hideFun:function(data){
                    FM.changePos(data)
                }
            })
        }
        else
        {
            if(FM.num)
                this.startInit();
            else
            {
                MyWindow.Confirm('是否花费'+FM.cost+'钻石直接开启下一轮远征？',(b)=>{
                    if(b==1)
                    {
                        this.startInit(true);
                    }
                })
            }



        }
    }

    public startInit(diamond?){
        var FM = FightManager.getInstance();
        PKBeforeUI.getInstance().show({
            title:'初始阵容',
            noTab:true,
            list:SharedObjectManager.getInstance().getMyValue('fightDefault') || PKManager.getInstance().getDefaultPKList(),
            fun:function(data){
                var arr = data.split(',')
                if(arr.length < PosManager.getInstance().maxPosNum())
                {
                    MyWindow.Confirm('还可继续上阵卡牌，确定就这样出战吗？',(b)=>{
                        if(b==1)
                        {
                            FM.initFight(data,diamond);
                        }
                    })
                    return;
                }
                FM.initFight(data,diamond)
            },
            hideFun:function(data){
                if(data)
                    SharedObjectManager.getInstance().setMyValue('fightDefault',data)
            }
        })
    }

    public show(){
        FightManager.getInstance().getInfo(()=>{
            super.show()
        })

    }

    public onShow(){
        this.getNextData = false
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        var FM = FightManager.getInstance();
        if(DateUtil.isSameDay(FM.shopTime))
        {
            var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
            this.cdText.text = DateUtil.getStringBySecond(cd);
        }
        else if(!this.getNextData)
        {
            this.getNextData = true
            FM.getInfo(()=>{
                this.renew()
                this.getNextData = false
            })
        }

    }

    private renewInfo(){
        var FM = FightManager.getInstance();
        this.valueText.text = '' + FM.value;
        if(FM.level == 0 && !FM.card)
        {
            this.currentState = 'first'
        }
        else
        {
            this.currentState = 'normal'


            this.stepText.text = '当前胜场：' + FM.step
            this.cardText.text = '剩余卡牌数量：' + FM.card.length
            this.numText.text = '今日挑战次数：' + (1-FM.num) + '/1'

            this.cancelBtn.visible = false;
            this.okBtn.visible = true;

            if(FM.award)
            {
                this.okBtn.label = '领取卡牌'
                this.cancelBtn.visible = true;
            }
            else if(FM.card.length == 0)
            {
                if(FM.num)
                {
                    this.okBtn.label = '重新开始'
                }
                else
                {
                    this.okBtn.label = '钻石重置'
                }
            }
            else
            {
                this.okBtn.label = '继续挑战'
                this.cancelBtn.visible = true;
            }
        }
    }

    private renew(){
        this.onTimer();
        this.list.dataProvider = new eui.ArrayCollection(FightManager.getInstance().shopData)
    }

}