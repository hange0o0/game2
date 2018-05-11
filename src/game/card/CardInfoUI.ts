class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    private helpBtn: eui.Image;
    private likeCB: eui.CheckBox;
    private likeBar: eui.Rect;
    private likeText: eui.Label;
    private unlikeCB: eui.CheckBox;
    private unlikeBar: eui.Rect;
    private unlikeText: eui.Label;
    private r0: eui.RadioButton;
    private r1: eui.RadioButton;
    private coinText: eui.Label;
    private icon: eui.Image;
    private okBtn: eui.Button;








    public data;
    public upAble = false;
    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.r0,this.onCB)
        this.addBtnEvent(this.r1,this.onCB)
        //this.r0.selected = true;

        this.addBtnEvent(this.likeCB,this.onLike)
        this.addBtnEvent(this.unlikeCB,this.onUnlike)

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('card')
        })

        this.touchEnabled = false;
    }

    private onLike(){
        var b = this.testSendLike(1)
        if(!b)
            this.renewCardLike();
    }
    private onUnlike(){
        var b = this.testSendLike(2)
        if(!b)
            this.renewCardLike();
    }

    private testSendLike(like){
        if(this.currentState == 'buy')
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
        return true;
    }

    private onCB(){
        SharedObjectManager.getInstance().setMyValue('show_card_base',this.r0.selected);
        this.renew();
    }

    private onClick(){
        if(!this.upAble)
            return
        if(this.data.isMonster)
        {
            CardManager.getInstance().card_open(this.data.id,()=>{
                this.renew();
            })
        }
        else
        {
             CardManager.getInstance().card_buy(this.data.id,()=>{
                 this.renew();
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
        this.r0.selected = SharedObjectManager.getInstance().getMyValue('show_card_base') || false;
        this.r1.selected = !this.r0.selected
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var CM = CardManager.getInstance()
        var homeLevel = TecManager.getInstance().getLevel(1)
        this.upAble = true
        if(this.r0.selected)
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
                this.currentState = 'normal'
            }
            else
            {
                this.currentState = 'buy'
                var coin = CM.getUpCoin(this.data.id);
                this.coinText.text = coin + ''
                this.upAble = coin <= UM.getCoin()
                this.okBtn.label = '解锁'
                this.okBtn.skinName = 'Btn1Skin'
                this.icon.source = MyTool.getPropCoin();
            }
        }
        //else
        //{
        //    if(CM.skillList[this.data.id] || this.data.level > homeLevel)
        //    {
        //        MyTool.removeMC(this.upGroup);
        //    }
        //    else
        //    {
        //        this.btnGroup.addChild(this.upGroup)
        //        this.coinText.text = CM.skillCost + ''
        //        this.upAble =  CM.skillCost <= PropManager.getInstance().getNum(103)
        //        this.okBtn.label = '兑换'
        //        this.okBtn.skinName = 'Btn8Skin'
        //        this.icon.source = PropVO.getObject(103).getThumb();
        //    }
        //}
        this.coinText.textColor = this.upAble?0xFFFFFF:0xFF0000;
        this.renewCardLike();
    }

    private renewCardLike(){
        var w = 180
        var likeObj = CardManager.getInstance().cardLike[this.data.id];
        this.likeText.text = NumberUtil.formatStrNum(likeObj.like_num) ||  '暂无票数'
        this.unlikeText.text = NumberUtil.formatStrNum(likeObj.unlike_num) ||  '暂无票数'
        var total = (likeObj.like_num + likeObj.unlike_num);
        if(total)
        {
            if(likeObj.like_num > likeObj.unlike_num)
            {
                this.likeBar.width = 10+w
                this.unlikeBar.width = 10+w * likeObj.unlike_num/likeObj.like_num
            }
            else if(likeObj.like_num < likeObj.unlike_num)
            {
                this.likeBar.width = 10+w * likeObj.like_num/likeObj.unlike_num
                this.unlikeBar.width = 10+w
            }
            else
            {
                this.likeBar.width = 10+w
                this.unlikeBar.width = 10+w
            }

        }
        else
        {
            this.likeBar.width = w
            this.unlikeBar.width = w
        }


        var myChoose = ActiveManager.getInstance().getLikeChoose(this.data.id)
        if(myChoose)
        {
            this.likeCB.selected = myChoose == 1
            this.unlikeCB.selected = myChoose == 2
        }
        else
        {
            this.likeCB.selected = false
            this.unlikeCB.selected = false
        }
    }
}