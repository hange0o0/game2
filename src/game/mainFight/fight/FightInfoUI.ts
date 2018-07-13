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
        this.addBtnEvent(this.cancelBtn,this.onCancel)

        this.touchEnabled = false;

        this.list.itemRenderer = FightShopItem
    }

    private onCancel(){
        var FM = FightManager.getInstance();
        if(FM.award)
        {
            MyWindow.Confirm('你目前可以领取5张卡牌加入你的卡组，是否仍继续结束本次远征？',(b)=>{
                if(b==1)
                {
                    this.sendCancel();
                }
            })
        }
        else if(FM.card.length)
        {
            MyWindow.Confirm('你目前还有'+FM.card.length+'张手牌，是否仍继续结束本次远征？',(b)=>{
                if(b==1)
                {
                    this.sendCancel();
                }
            })
        }
        else
            this.sendCancel();

    }

    private sendCancel(){
        FightManager.getInstance().fightCancel()
    }

    private onClick(){
        var FM = FightManager.getInstance();
        if(FM.award)
        {
            FightAwardUI.getInstance().show();
        }
        else if(FM.card.length)
        {
              this.changeCard();
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

    public changeCard(){
        var FM = FightManager.getInstance();
        PKBeforeUI.getInstance().show({
            stopAdd:true,
            title:'调整阵容',
            noTab:true,
            stopTest:true,
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

    public startInit(diamond?){
        var FM = FightManager.getInstance();
        PKBeforeUI.getInstance().show({
            title:'初始阵容',
            noTab:true,
            stopTest:true,
            stopRemoveTips:true,
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
                SharedObjectManager.getInstance().setMyValue('fightDefault',data)
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
        this.addPanelOpenEvent(GameEvent.client.fight_change,this.renew)
    }

    private onTimer(){
        var FM = FightManager.getInstance();
        if(DateUtil.isSameDay(FM.shopTime))
        {
            var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
            this.cdText.text = DateUtil.getStringBySecond(cd) + '后刷新';
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
        if(FM.step == -1)
        {
            this.currentState = 'first'
            this.okBtn.label = '开始挑战'
        }
        else
        {
            this.currentState = 'normal'


            this.stepText.text = '当前胜场：' + FM.step
            this.cardText.text = '剩余卡牌数量：' + FM.card.length
            this.numText.text = '今日挑战次数：' + (FM.num) + '/1'

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
        this.renewInfo();
        this.onTimer();
        this.list.dataProvider = new eui.ArrayCollection(FightManager.getInstance().shopData)
    }

}