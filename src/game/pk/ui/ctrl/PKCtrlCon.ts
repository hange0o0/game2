class PKCtrlCon extends game.BaseContainer {

    public constructor() {
        super();

        this.skinName = "PKCtrlConSkin";
    }

    public overMC: eui.Group;
    public cardGroup: eui.Group;
    private replayGroup: eui.Group;
    private vPlayer1: eui.Button;
    private vPlayer2: eui.Button;
    private placeGroup: eui.Group;
    public costGroup: eui.Group;
    private info2: PKInfoBtn;
    private info1: PKInfoBtn;
    private info4: PKInfoBtn;
    private info3: PKInfoBtn;
    private settingBtn: eui.Image;
    private timeText: eui.Label;
    private cardText: eui.Label;
    private costMC: eui.Image;
    private costText: eui.Label;
    private helpBtn: eui.Image;













    public cardObj = {};
    public placeArr = [];
    public chooseCard:PKCardItem;

    private dragTarget
    private overTarget

    private lastAddCardTime = 0//上次加卡的时间
    private needRenewCard = false
    private needRenewInfo = false




    public childrenCreated() {
        super.childrenCreated();
        //for(var i=0;i< PKConfig.maxPosCard;i++)
        //{
        //    var mc = this['p' + i]
        //    this.addBtnEvent(mc,this.onPosClick)
        //    this.placeObj[i+1] = mc;
        //    mc.index = i+1
        //    mc.dataChanged();
        //}

        for(var i=0;i<PKConfig.maxHandCard;i++)
        {
            var item:PKCardItem = new PKCardItem();
            item = new PKCardItem();
            this.cardGroup.addChild(item);
            this.cardObj[i+1] = item;
            item.y = item.defaultY;
            item.x = i*102 + 20
            item.con = this;

            DragManager.getInstance().setDrag(item,true);
            item.addEventListener('start_drag',this.onDragStart,this);
            item.addEventListener('end_drag',this.onDragEnd,this);
            item.addEventListener('move_drag',this.onDragMove,this);
        }

        this.dragTarget = new PKCardItem();
        this.dragTarget.isDragMC = true;
        this.dragTarget.alpha = 0.6

        this.addBtnEvent(this.placeGroup,this.onPosClick)
            this.addBtnEvent(this.settingBtn,this.onSetting)
        this.addBtnEvent(this.helpBtn,this.onHelp)
        this.addBtnEvent(this.vPlayer1,this.onPlayer1)
        this.addBtnEvent(this.vPlayer2,this.onPlayer2)

        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }

    private onPlayer1(){
        PKData.getInstance().changeMyPlayer(1)
    }
    private onPlayer2(){
        PKData.getInstance().changeMyPlayer(2)
    }

    private onHelp(){
        if(GuideManager.getInstance().isGuiding && GuideManager.getInstance().guideKey != "pk")
        {
            MyWindow.ShowTips('新手引导期间不能点击')
            return;
        }
        PKingUI.getInstance().setStop(true)
        HelpManager.getInstance().showHelp('pk',()=>{
            PKingUI.getInstance().setStop(false)
        })
    }
    private onSetting(){
        if(GuideManager.getInstance().isGuiding)
        {
            MyWindow.ShowTips('新手引导期间不能点击')
            return;
        }
        PKingUI.getInstance().setStop(true)
        PKSettingUI.getInstance().show();
    }



    public onVideoEvent(e){
        if(!this.stage)
            return;
        //var item:PKMonsterItem;
        var videoData = e.data;
        //var data:PKMonsterData = videoData.user;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_MONSTER_DIE:
                this.needRenewInfo = true;
                break;
            //case PKConfig.VIDEO_POS_FAIL:
            //    if(videoData.user.getOwner() == PKData.getInstance().myPlayer)
            //        this.placeObj[videoData.user.id].showFail()
            //    break;
            case PKConfig.VIDEO_POS_ADD:
                if(videoData.user.getOwner() == PKData.getInstance().myPlayer)
                {
                    this.addPosItem(videoData.user)
                }
                break;
            case PKConfig.VIDEO_POS_REMOVE:
                if(videoData.user.getOwner() == PKData.getInstance().myPlayer)
                {
                    this.mvRemoveItem(videoData.user)
                }
                break;
            case PKConfig.VIDEO_MYPLAYER_CHANGE:
                this.onMyPlayerChange();
                break;
            case PKConfig.VIDEO_AUOT_ADD_CARD:
                this.onAddPosCard(videoData.user);
                break;
            case PKConfig.VIDEO_CARD_WAITING_CHANGE:
                this.needRenewCard = true;
                break;
        }
    }

    private addPosItem(data){
        var item = PKPosItem.createItem()
        this.placeGroup.addChild(item);
        item.data = data;
        item.mvAdd();
        this.placeArr.push(item);
        this.needRenewCard = true;
    }

    private mvRemoveItem(data){
        for(var i=0;i<this.placeArr.length;i++)
        {
            var item = this.placeArr[i];
            if(item.data == data)
            {
                item.mvRemove(()=>{
                    this.removePosItem(data)
                });
                break;
            }
        }
    }

    private removePosItem(data){
        for(var i=0;i<this.placeArr.length;i++)
        {
            var item = this.placeArr[i];
            if(item.data == data)
            {
                this.placeArr.splice(i,1);
                PKPosItem.freeItem(item)
                break;
            }
        }
    }

    private getInfoPlayer(index){
        if(index <= 2)
            return PKData.getInstance().getTeamByRota(PKConfig.ROTA_LEFT).members[index-1]
        return PKData.getInstance().getTeamByRota(PKConfig.ROTA_RIGHT).members[index-3]
    }


    private onPosClick(e){
        if(game.BaseUI.isStopEevent)
            return;
        if(this.chooseCard)
        {
             if(this.posCard())
             {
                 if(GuideManager.getInstance().isGuiding && GuideManager.getInstance().guideKey == "addCard")
                 {
                     GuideManager.getInstance().showGuide()
                 }
             }
        }
        else //显示上阵卡牌信息
        {

        }
    }

    private posCard(){
        var PD = PKData.getInstance();
        var mp = CM.getCardVO(this.chooseCard.data.mid).cost
        if(PD.myPlayer.getMP() < mp)
            return false;


        var cardData = this.chooseCard.data
        this.onAddPosCard(cardData)
        PD.myPlayer.addPosCard(cardData);
        return true;
    }

    private onAddPosCard(data){
        if(this.dragTarget && this.dragTarget.data == data)
        {
            MyTool.removeMC(this.dragTarget)
            this.overMC.visible = false
            this.dragTarget.data = null;
            this.overMC.visible = false
        }
        if(this.chooseCard && this.chooseCard.data == data)
            this.chooseCard = null
        this.cardObj[data.cardPos].data.waiting = true;
        this.cardObj[data.cardPos].dataChanged();
        //this.needRenewCard = true
        //this.renewCard()
    }

    //服务器返回加入卡成功
    private onAddCardOK(){
        this.needRenewCard = true
        this.renewCard()
    }

    private onDragStart(e){
        //e.stopImmediatePropagation();
        e.target.alpla = 0.8;
        this.chooseCard = e.target;
        this.renewChooseCard();
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
        this.overMC.visible = false

        if(e.data.y> GameManager.stage.stageHeight - 160 - 230 && e.data.y < GameManager.stage.stageHeight - 160)
        {
            this.overTarget = 1;
            this.overMC.visible = true
        }


        //for(var s in this.placeObj)
        //{
        //    var mc:PKPosItem = this.placeObj[s];
        //    if(mc.canPos())
        //    {
        //        if(this.overTarget== -1 && mc.hitTestPoint(e.data.x,e.data.y))
        //        {
        //            mc.setOver(true)
        //            this.overTarget = mc.index;
        //        }
        //        else
        //        {
        //            mc.setOver(false)
        //        }
        //    }
        //}
    }


    private onDragEnd(e){
        //e.stopImmediatePropagation();
        //var target = this.getTestTarget(this.dragTarget.x + this.dragTarget.width/2,this.dragTarget.y + this.dragTarget.height/2)
        MyTool.removeMC(this.dragTarget)

        //for(var s in this.placeObj)
        //{
        //    var mc:PKPosItem = this.placeObj[s];
        //    mc.setOver(false)
        //}
        if(this.overTarget != -1)
        {
            if(this.dragTarget.data)
                this.posCard()
        }
        this.overMC.visible = false
    }

    public remove(){
        for(var s in this.cardObj)
        {
            this.cardObj[s].data = null;
        }
        while(this.placeArr.length)
        {
            PKPosItem.freeItem(this.placeArr.pop())
        }

    }


    public init(){
        var PD = PKData.getInstance();
        this.lastAddCardTime = 0;
        this.chooseCard = null;
        this.needRenewCard = true;
        this.needRenewInfo = false;
        this.overMC.visible = false

        this.remove();
        this.renewCard();
        this.costMC.mask = new egret.Rectangle(0,32-0,27,0);
        this.costText.text = 'x' + PKConfig.mpInit
        this.timeText.text = '' + DateUtil.getStringBySecond(0).substr(-5)

        for(var i=1;i<=4;i++)
        {
            var mc = this['info' + i];
            mc.visible = false;
        }

        if(PD.isReplay)
        {
             this.cardGroup.visible = false
             this.replayGroup.visible = true
            this.vPlayer1.label = PD.getPlayer(1).nick
            this.vPlayer2.label = PD.getPlayer(2).nick
            this.renewReplay();
        }
        else
        {
             this.cardGroup.visible = true
             this.replayGroup.visible = false
        }
    }

    public onMyPlayerChange(){
        var myPlayer = PKData.getInstance().myPlayer
        while(this.placeArr.length)
        {
            PKPosItem.freeItem(this.placeArr.pop())
        }

        for(var s in myPlayer.posCard)
        {
            var data = myPlayer.posCard[s];
            if(!data)
                continue;
            var item = PKPosItem.createItem()
            this.placeGroup.addChild(item);
            item.data = data;
            this.placeArr.push(item);
        }

        this.needRenewInfo = true
        this.renewInfo();
        this.renewReplay();
    }

    public renewReplay(){
        var PD = PKData.getInstance();
        if(PD.myPlayer.id == 1)
        {
            this.vPlayer1.skinName = 'Btn1Skin'
            this.vPlayer2.skinName = 'Btn2Skin'
        }
        else
        {
            this.vPlayer1.skinName = 'Btn2Skin'
            this.vPlayer2.skinName = 'Btn1Skin'
        }
    }

    public initInfo(){
        for(var i=1;i<=4;i++)
        {
            var player = this.getInfoPlayer(i);
            var mc = this['info' + i];
            if(player)
            {
                mc.visible = true;
                mc.data = player;
            }
            else
            {
                mc.visible = false;
            }
        }
    }

    public onTimer(){
        var PD = PKData.getInstance();
        for(var s in this.placeArr)
        {
            this.placeArr[s].onTimer();
        }
        var mp = PD.myPlayer.getMP();
        var mpRate = PD.myPlayer.nextMpRate()
        for(var s in this.cardObj)
        {
            var item = this.cardObj[s];
            item.onMpTest(mp+mpRate);
        }
        this.renewCard();
        this.renewInfo();

        //this.barMC.width = 640 * ((PD.myPlayer.getMP() + PD.myPlayer.nextMpRate()) / PKConfig.maxMP);
        //this.rateText.text = PD.myPlayer.getMP() + '/' + PKConfig.maxMP

        var height = 32*(mpRate)
        this.costMC.mask = new egret.Rectangle(0,32-height,27,height);

        this.costText.text = 'x' + PD.myPlayer.getMP()
        this.timeText.text = '' + DateUtil.getStringBySecond(PD.actionTime/1000).substr(-5)
    }



    private renewInfo(){
        if(this.needRenewInfo)
        {
            this.needRenewInfo = false;
            for(var i=1;i<=4;i++)
            {
                var mc = this['info' + i];
                mc.dataChanged();
            }
        }
    }

    public setChooseCard(card){
        if(this.chooseCard == card)
            this.chooseCard = null;
        else
            this.chooseCard = card;

        this.renewChooseCard();
    }

    private renewChooseCard(){
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
                if((!item.data || item.data.remove))
                {
                    if( handCard[s])
                    {
                        item.data = handCard[s]
                        item.appear();
                    }
                    else
                    {
                        item.data = null;
                    }

                }
            }
            this.cardText.text = 'x' + PD.myPlayer.getCardNum();
        }

    }
}