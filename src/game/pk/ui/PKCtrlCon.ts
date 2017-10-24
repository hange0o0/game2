class PKCtrlCon extends game.BaseContainer {

    public constructor() {
        super();

        this.skinName = "PKCtrlConSkin";
    }

    private cardGroup: eui.Group;
    private placeGroup: eui.Group;
    private p0: PKPosItem;
    private p1: PKPosItem;
    private p2: PKPosItem;
    private p3: PKPosItem;


    public cardPool = [];
    public cardArr = [];
    public placeObj = {};
    public chooseCard:PKCardItem;

    private lastAddCardTime = 0//上次加卡的时间
    private needRenewCard = false


    public childrenCreated() {
        super.childrenCreated();
        for(var i=0;i<4;i++)
        {
            var mc = this['p' + i]
            this.addBtnEvent(mc,this.onPosClick)
            this.placeObj[i+1] = mc;
            mc.index = i+1
        }

    }

    private onPosClick(e){
        var PD = PKData.getInstance();
         var mc:PKPosItem = e.currentTarget;
        if(this.chooseCard)
        {
            if(mc.canPos())
            {
                PD.myPlayer.addPosCard(mc.index,this.chooseCard.data);

                var index = this.cardArr.indexOf(this.chooseCard);
                this.cardArr.splice(index,1)
                this.freeItem(this.chooseCard)
                this.chooseCard = null
                this.needRenewCard = true
            }
        }
        else //显示上阵卡牌信息
        {

        }
    }

    public init(){
        var PD = PKData.getInstance();
        this.lastAddCardTime = 0;
        this.chooseCard = null;
        this.needRenewCard = false;
        while(this.cardArr.length)
        {
            var item = this.cardArr.pop();
            this.freeItem(item);
        }
        this.renewCard();

    }

    private createItem():PKCardItem{
        var item:PKCardItem = this.cardPool.pop();
        if(!item)
        {
            item = new PKCardItem();
            item.y = 20;
            item.con = this;
        }
        return item;
    }

    private freeItem(item){
        if(!item)
            return;
        item.remove();
        this.cardPool.push(item);
    }

    public onTimer(){
        for(var s in this.placeObj)
        {
            this.placeObj[s].onTimer();
        }
        this.renewCard();
    }

    public setChooseCard(card){
        if(this.chooseCard == card)
            this.chooseCard = null;
        else
            this.chooseCard = card;
        for(var i=0;i<this.cardArr.length;i++)
        {
            var item = this.cardArr[i];
            item.renewChoose();
        }
    }

    //更新卡
    public renewCard(){
        var PD = PKData.getInstance();
        var handCard = PKData.getInstance().myPlayer.getHandCard()
        if(this.lastAddCardTime == 0)
        {
             for(var i=0;i<handCard.length;i++)
             {
                  var item = this.createItem();
                 this.cardGroup.addChild(item);
                 this.cardArr.push(item);
                 item.data = handCard[i];
                 item.x = this.getCardPos(i);
                 item.appear();
             }
            this.lastAddCardTime = 1;
        }
        else if(this.lastAddCardTime + PKConfig.addCardCD < PD.actionTime && this.cardArr.length < handCard.length)
        {
            var index = this.cardArr.length;
            var item = this.createItem();
            this.cardGroup.addChild(item);
            this.cardArr.push(item);
            item.data = handCard[index];
            item.x = 640;
            this.renewCardPos();
            this.lastAddCardTime = PD.actionTime;
        }
        else if(this.needRenewCard)
        {
             this.renewCardPos();
        }
    }

    private getCardPos(index)
    {
        return index*110 + 30
    }

    private renewCardPos(){
        for(var i=0;i<this.cardArr.length;i++)
        {
            var item = this.cardArr[i];
            var targetX = this.getCardPos(i);
            if(item.x > targetX)
            {
                egret.Tween.removeTweens(item);
                var tw = egret.Tween.get(item);
                tw.to({x:targetX - 5},(item.x - targetX)*2).to({x:targetX},100);
            }
        }
        this.needRenewCard = false
    }

}