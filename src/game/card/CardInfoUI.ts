class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    private btnGroup: eui.Group;
    private backBtn: eui.Button;
    private upGroup: eui.Group;
    private coinText: eui.Label;
    private icon: eui.Image;
    private okBtn: eui.Button;
    private helpBtn: eui.Image;
    private bar1: eui.Rect;
    private bar2: eui.Rect;
    private likeBtn: eui.Group;
    private likeIcon: eui.Image;
    private likeText: eui.Label;
    private likeChooseMC: eui.Image;
    private unlikeBtn: eui.Group;
    private unlikeIcon: eui.Image;
    private unlikeText: eui.Label;
    private unlikeChooseMC: eui.Image;
    private cb: eui.CheckBox;






    public data;
    public upAble = false;
    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cb,this.onCB)
        this.addBtnEvent(this.likeBtn,this.onLike)
        this.addBtnEvent(this.unlikeBtn,this.onUnlike)

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('card')
        })
    }

    private onLike(){
        this.testSendLike(1)
    }
    private onUnlike(){
        this.testSendLike(2)
    }

    private testSendLike(like){
        if(this.upGroup.stage)
        {
            MyWindow.ShowTips('你还没拥有该卡牌，无法投票')
            return false
        }
        var myChoose = ActiveManager.getInstance().getLikeChoose(this.data.id)
        if(myChoose)
        {
            MyWindow.ShowTips('今天你已对该卡牌投过票了')
            return false
        }
        if(ObjectUtil.objLength(ActiveManager.getInstance().like_obj) >= 10)
        {
            MyWindow.ShowTips('今天你投票次数已达10次，无法继续')
            return false
        }
        CardManager.getInstance().setCardLike(this.data.id,like,()=>{
            this.renewCardLike();
        })
    }

    private onCB(){
        SharedObjectManager.getInstance().setMyValue('show_card_base',this.cb.selected);
        this.renew();
    }

    private onClick(){
        if(!this.upAble)
            return
        if(this.data.isMonster)
        {
            CardManager.getInstance().card_open(this.data.id,()=>{
                this.hide();
            })
        }
        else
        {
             CardManager.getInstance().card_buy(this.data.id,()=>{
                 this.hide();
             })
        }
    }

    public show(v?){
        this.data = v;
        CardManager.getInstance().getCardLike(this.data.id,()=>{
            super.show()
        })

    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.cb.selected = SharedObjectManager.getInstance().getMyValue('show_card_base');
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var CM = CardManager.getInstance()
        var homeLevel = TecManager.getInstance().getLevel(1)
        this.upAble = true
        if(this.cb.selected)
        {
            this.item.renew({
                mid:this.data.id,
                force:0,
                type:0
            });
        }
        else
        {
            this.item.renew({
                mid:this.data.id,
                force:UM.tec_force,
                type:UM.type
            });
        }


        if(this.data.isMonster)
        {
            if(CM.monsterList[this.data.id] || this.data.level > homeLevel)
            {
                MyTool.removeMC(this.upGroup);
            }
            else
            {
                this.btnGroup.addChild(this.upGroup)
                var coin = CM.getUpCoin(this.data.id);
                this.coinText.text = coin + ''
                this.upAble = coin <= UM.getCoin()
                this.okBtn.label = '解锁'
                this.okBtn.skinName = 'Btn1Skin'
                this.icon.source = MyTool.getPropCoin();
            }
        }
        else
        {
            if(CM.skillList[this.data.id] || this.data.level > homeLevel)
            {
                MyTool.removeMC(this.upGroup);
            }
            else
            {
                this.btnGroup.addChild(this.upGroup)
                this.coinText.text = CM.skillCost + ''
                this.upAble =  CM.skillCost <= PropManager.getInstance().getNum(103)
                this.okBtn.label = '兑换'
                this.okBtn.skinName = 'Btn8Skin'
                this.icon.source = PropVO.getObject(103).getThumb();
            }
        }
        this.cb.x = this.upGroup.stage?30:176
        this.coinText.textColor = this.upAble?0xFFFFFF:0xFF0000;
        this.renewCardLike();
    }

    private renewCardLike(){
        var w = 540
        var likeObj = CardManager.getInstance().cardLike[this.data.id];
        this.likeText.text = '要加强 (' + NumberUtil.formatStrNum(likeObj.like_num) + ')'
        this.unlikeText.text = '要削弱 (' + NumberUtil.formatStrNum(likeObj.unlike_num)  +')'
        var total = (likeObj.like_num + likeObj.unlike_num) || 1;
        this.bar1.width = w * likeObj.like_num/total
        this.bar2.width = w * likeObj.unlike_num/total

        var myChoose = ActiveManager.getInstance().getLikeChoose(this.data.id)
        this.likeChooseMC.visible = myChoose != 2
        this.unlikeChooseMC.visible = myChoose != 1

    }
}