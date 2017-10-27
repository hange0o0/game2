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
    private barMC: eui.Rect;
    private rateText: eui.Label;



    public cardObj = {};
    public placeObj = {};
    public chooseCard:PKCardItem;

    private dragTarget
    private overTarget

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

        for(var i=0;i<PKConfig.maxHandCard;i++)
        {
            var item:PKCardItem = new PKCardItem();
            item = new PKCardItem();
            this.cardGroup.addChild(item);
            this.cardObj[i+1] = item;
            item.y = 20;
            item.x = i*105 + 10
            item.con = this;

            DragManager.getInstance().setDrag(item,true);
            item.addEventListener('start_drag',this.onDragStart,this);
            item.addEventListener('end_drag',this.onDragEnd,this);
            item.addEventListener('move_drag',this.onDragMove,this);
        }

        this.dragTarget = new PKCardItem();
        this.dragTarget.isDragMC = true;
        this.dragTarget.alpha = 0.5

    }

    private onPosClick(e){

         var mc:PKPosItem = e.currentTarget;
        if(this.chooseCard)
        {
             if(this.posCard(mc))
             {

             }
        }
        else //显示上阵卡牌信息
        {

        }
    }

    private posCard(mc:PKPosItem){
        var PD = PKData.getInstance();
        var mp = MonsterVO.getObject(this.chooseCard.data.mid).cost1
        if(PD.myPlayer.getMP() < mp)
            return false;

        if(mc.canPos())
        {
            PD.myPlayer.addPosCard(mc.index,this.chooseCard.data);
            this.cardObj[this.chooseCard.data.cardPos].data = null;
            this.chooseCard = null
            this.needRenewCard = true
            return true;
        }
        return false;
    }

    private onDragStart(e){
        //e.stopImmediatePropagation();
        e.target.alpla = 0.8;
        this.chooseCard = e.target;
        this.dragTarget.data = e.target.data
        this.stage.addChild(this.dragTarget);
        this.dragTarget.x = e.data.x;
        this.dragTarget.y = e.data.y;
    }
    private onDragMove(e){
        //e.stopImmediatePropagation();
        this.dragTarget.x = e.data.x - this.dragTarget.width/2;
        this.dragTarget.y = e.data.y - this.dragTarget.height/2;
        this.overTarget = -1;


        for(var s in this.placeObj)
        {
            var mc:PKPosItem = this.placeObj[s];
            if(mc.canPos())
            {
                if(this.overTarget== -1 && mc.hitTestPoint(e.data.x,e.data.y))
                {
                    mc.setOver(true)
                    this.overTarget = mc.index;
                }
                else
                {
                    mc.setOver(false)
                }
            }
        }
    }


    private onDragEnd(e){
        //e.stopImmediatePropagation();
        //var target = this.getTestTarget(this.dragTarget.x + this.dragTarget.width/2,this.dragTarget.y + this.dragTarget.height/2)
        MyTool.removeMC(this.dragTarget)

        for(var s in this.placeObj)
        {
            var mc:PKPosItem = this.placeObj[s];
            mc.setOver(false)
        }

        if(this.overTarget != -1)
        {
            this.posCard(this.placeObj[this.overTarget])

        }
    }


    public init(){
        var PD = PKData.getInstance();
        this.lastAddCardTime = 0;
        this.chooseCard = null;
        this.needRenewCard = true;

        for(var s in this.cardObj)
        {
            this.cardObj[s].data = null;
        }
        this.renewCard();

    }

    public onTimer(){
        var PD = PKData.getInstance();
        for(var s in this.placeObj)
        {
            this.placeObj[s].onTimer();
        }
        this.renewCard();

        this.barMC.width = 640 * ((PD.myPlayer.getMP() + PD.myPlayer.nextMpRate()) / PKConfig.maxMP);
        this.rateText.text = PD.myPlayer.getMP() + '/' + PKConfig.maxMP
    }

    public setChooseCard(card){
        if(this.chooseCard == card)
            this.chooseCard = null;
        else
            this.chooseCard = card;

        for(var s in this.cardObj)
        {
            var item = this.cardObj[s];
            item.renewChoose();
        }
    }

    //更新卡
    public renewCard(){
        if(this.needRenewCard)
        {
            this.needRenewCard = false;
            var PD = PKData.getInstance();
            var handCard = PKData.getInstance().myPlayer.getHandCard();

            for(var s in this.cardObj)
            {
                var item = this.cardObj[s];
                if(!item.data && handCard[s])
                {
                    item.data = handCard[s]
                    item.appear();
                }
            }
        }
        //if(this.lastAddCardTime == 0)
        //{
        //     for(var i=0;i<handCard.length;i++)
        //     {
        //          var item = this.createItem();
        //         this.cardGroup.addChild(item);
        //         this.cardArr.push(item);
        //         item.data = handCard[i];
        //         item.x = this.getCardPos(i);
        //         item.appear();
        //     }
        //    this.lastAddCardTime = 1;
        //}
        //else if(this.lastAddCardTime + PKConfig.addCardCD < PD.actionTime && this.cardArr.length < handCard.length)
        //{
        //    var index = this.cardArr.length;
        //    var item = this.createItem();
        //    this.cardGroup.addChild(item);
        //    this.cardArr.push(item);
        //    item.data = handCard[index];
        //    item.x = 640;
        //    this.renewCardPos();
        //    this.lastAddCardTime = PD.actionTime;
        //}
        //else if(this.needRenewCard)
        //{
        //     this.renewCardPos();
        //}
    }



}