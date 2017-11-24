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
    private info1: eui.Label;
    private info2: eui.Label;
    private info4: eui.Label;
    private info3: eui.Label;





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

        this.info1.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onInfo1,this)
        this.info2.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onInfo2,this)
        this.info3.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onInfo3,this)
        this.info4.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onInfo4,this)
        this.info1.touchEnabled = true
        this.info2.touchEnabled = true
        this.info3.touchEnabled = true
        this.info4.touchEnabled = true

        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
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

    private onInfo1(){
       PKMonsterInfoUI.getInstance().show(this.getInfoPlayer(1))
    }
    private onInfo2(){
       PKMonsterInfoUI.getInstance().show(this.getInfoPlayer(2))
    }
    private onInfo3(){
       PKMonsterInfoUI.getInstance().show(this.getInfoPlayer(3))
    }
    private onInfo4(){
       PKMonsterInfoUI.getInstance().show(this.getInfoPlayer(4))
    }

    private getInfoPlayer(index){
        if(index <= 2)
            return PKData.getInstance().getTeamByRota(PKConfig.ROTA_LEFT).members[index-1]
        return PKData.getInstance().getTeamByRota(PKConfig.ROTA_RIGHT).members[index-3]
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
        this.needRenewInfo = true;

        for(var s in this.cardObj)
        {
            this.cardObj[s].data = null;
        }
        this.renewCard();
        this.renewInfo();

    }

    public onTimer(){
        var PD = PKData.getInstance();
        for(var s in this.placeObj)
        {
            this.placeObj[s].onTimer();
        }
        var mp = PD.myPlayer.getMP();
        for(var s in this.cardObj)
        {
            var item = this.cardObj[s];
            item.onMpTest(mp);
        }
        this.renewCard();
        this.renewInfo();

        //this.barMC.width = 640 * ((PD.myPlayer.getMP() + PD.myPlayer.nextMpRate()) / PKConfig.maxMP);
        //this.rateText.text = PD.myPlayer.getMP() + '/' + PKConfig.maxMP


    }

    private renewInfo(){
        if(this.needRenewInfo)
        {
            var PD = PKData.getInstance();
            this.needRenewInfo = false;
            for(var i=1;i<=4;i++)
            {
                var player = this.getInfoPlayer(i);
                var mc = this['info' + i];
                if(player)
                {
                    mc.text = PD.getMonsterByPlayer(player.id).length + ''
                }
                else
                    mc.text = ''
            }
        }
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

    }



}