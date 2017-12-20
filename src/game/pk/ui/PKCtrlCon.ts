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
    private info2: PKInfoBtn;
    private info1: PKInfoBtn;
    private info4: PKInfoBtn;
    private info3: PKInfoBtn;
    private settingBtn: eui.Image;
    private timeText: eui.Label;
    private cardText: eui.Label;
    private costMC: eui.Image;
    private costText: eui.Label;









    public cardObj = {};
    public placeObj = {};
    public chooseCard:PKCardItem;

    private dragTarget
    private overTarget

    private lastAddCardTime = 0//上次加卡的时间
    private needRenewCard = false
    private needRenewInfo = false




    public childrenCreated() {
        super.childrenCreated();
        for(var i=0;i< PKConfig.maxPosCard;i++)
        {
            var mc = this['p' + i]
            this.addBtnEvent(mc,this.onPosClick)
            this.placeObj[i+1] = mc;
            mc.index = i+1
            mc.dataChanged();
        }

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


            this.addBtnEvent(this.settingBtn,this.onSetting)

        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }

    private onSetting(){
         PKSettingUI.getInstance().show();
    }



    public onVideoEvent(e){
        var item:PKMonsterItem;
        var videoData = e.data;
        var data:PKMonsterData = videoData.user;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_MONSTER_DIE:
                this.needRenewInfo = true;
                break;
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
        if(this.chooseCard.data.mid < 100)
            var mp = MonsterVO.getObject(this.chooseCard.data.mid).cost
        else
            var mp = SkillVO.getObject(this.chooseCard.data.mid).cost
        if(PD.myPlayer.getMP() < mp)
            return false;

        if(mc.canPos())
        {
            PD.myPlayer.addPrePosCard(mc.index,this.chooseCard.data);
            this.cardObj[this.chooseCard.data.cardPos].data = null;
            this.chooseCard = null
            this.needRenewCard = true
            this.renewCard()
            return true;
        }
        return false;
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
        this.needRenewInfo = false;

        for(var s in this.cardObj)
        {
            this.cardObj[s].data = null;
        }
        this.renewCard();


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
        for(var s in this.placeObj)
        {
            this.placeObj[s].onTimer();
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
                if(!item.data && handCard[s])
                {
                    item.data = handCard[s]
                    item.appear();
                }
            }
            this.cardText.text = 'x' + (ObjectUtil.objLength(PD.myPlayer.getHandCard(),true) + PD.myPlayer.hideCard.length)
        }

    }
}