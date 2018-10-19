class HangUI extends game.BaseItem {

    private static _instance: HangUI;
    public static getInstance(): HangUI {
        if(!this._instance)
            this._instance = new HangUI();
        return this._instance;
    }

    private con: eui.Group;
    private clockGroup: eui.Group;
    private timeText: eui.Label;
    private titleText: eui.Label;
    private awardBtn: eui.Button;
    private lockGroup: eui.Group;
    private lockBar: eui.Rect;
    private lockText: eui.Label;
    public openBtn: eui.Button;
    private awardRed: eui.Image;
    private helpBtn: eui.Image;
    private videoBtn: eui.Group;
    private videoBtn2: eui.Group;
    private videoIcon: eui.Image;
    private giftGroup: eui.Group;
    private giftMC: eui.Image;
    private modeGroup: eui.Group;
    private autoBtn: eui.Button;
    private handBtn: eui.Button;
    private guideGroup: eui.Group;
    private guideText: eui.Label;
    private enemyForceText: eui.Label;












    //private monsterArr = []
    private cost1 = 0
    private cost2 = 0
    private overCount = 10

    private initTime
    private openTimer
    private lastRota = 0

    private pkMV;
    private callStop = true;
    private giftTW;
    private otherList;
    private history;

    public constructor() {
        super();
        this.skinName = "HangUISkin";
        HangUI._instance = this;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onPK)
        this.addBtnEvent(this.awardBtn,this.onAward)

        this.addBtnEvent(this.helpBtn,(e)=>{
            e.stopImmediatePropagation()
            HelpManager.getInstance().showHelp('hang')
        })
        this.addBtnEvent(this.videoBtn,(e)=>{
            e.stopImmediatePropagation()
            VideoUI.getInstance().show()
        })
        this.addBtnEvent(this.videoBtn2,(e)=>{
            e.stopImmediatePropagation()
            HangHelpUI.getInstance().show()
        })
        this.addBtnEvent(this.giftMC,(e)=>{
            e.stopImmediatePropagation()
            GiftUI.getInstance().show()
        })
        this.addBtnEvent(this.autoBtn,this.onAuto)
        this.addBtnEvent(this.handBtn,this.onHand)

        this.guideText.text = '点击屏幕可开始战斗\n通关战役5后有惊喜哦！'
        this.guideGroup.visible = false;


        var name = 'pk_mv'
        var data:any = RES.getRes(name + "_json"); //qid
        var texture:egret.Texture = RES.getRes(name + "_png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.pkMV =  new egret.MovieClip();
        this.pkMV.movieClipData = mcFactory.generateMovieClipData('mv');
        this.addChild(this.pkMV);
        this.pkMV.x = 320;
        this.pkMV.scaleX = this.pkMV.scaleY = 1.5
        //this.pkMV.gotoAndPlay(1,0)

        //var blurFliter = new egret.BlurFilter( 10 , 10);
        //this.bg.filters = [blurFliter];
        //this.bg.cacheAsBitmap  = true;

        this.initTime = egret.getTimer();

        var tw = this.giftTW = egret.Tween.get(this.giftMC,{loop:true});
        tw.to({scaleX:1.1,scaleY:0.8},200).to({scaleX:1,scaleY:1.1,y:this.giftMC.y -10},200).
            to({scaleX:1.1,scaleY:0.8,y:this.giftMC.y},200).to({scaleX:1,scaleY:1},300).wait(2000);
        this.giftTW.setPaused(true)
        this.modeGroup.visible = false;
    }

    public resetHeight(h){
        this.height = h;
        this.con.mask = new egret.Rectangle(0,0,640,h-this.con.top)
    }

    private onAuto(e?){
        e && e.stopImmediatePropagation()
        this.modeGroup.visible = false;
        PKBeforeUI.getInstance().show({
            isAuto:true,
            title:'自动挑战 战役' + (HangManager.getInstance().level + 1),
            otherList:this.otherList,
            history:this.history,
            fun:function(id){
                HangManager.getInstance().pk(id,true)
            }
        })
    }
    private onHand(e?){
        e && e.stopImmediatePropagation()
        this.modeGroup.visible = false;
        PKBeforeUI.getInstance().show({
            title:'手动挑战 战役' + (HangManager.getInstance().level + 1),
            otherList:this.otherList,
            history:this.history,
            fun:function(id){
                HangManager.getInstance().pk(id)
            }
        })
    }

    public onPK(){
        if(this.lockGroup.visible)
            return;
        if(this.modeGroup.visible)
        {
            this.modeGroup.visible = false;
            return;
        }

        if(HangManager.getInstance().level >= 5)
        {
            this.modeGroup.visible = true;
        }
        else
        {
            this.onHand();
        }

    }

    public onAward(e){
         e.stopImmediatePropagation()
        HangManager.getInstance().award(()=>{
            this.awardBtn.visible = false
            this.awardRed.visible = false
            this.resetGiftPos();
            this.onTimer();
        })
    }

    private resetGiftPos(){
        this.giftGroup.bottom = this.awardBtn.visible?70:10
    }


    //public onShow(){
    //    this.renew();
    //    this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    //}

    public onTimer(){
        if(this.openBtn.visible)
            return;

        var HM = HangManager.getInstance();


        if(this.lockGroup.visible)
        {
            var cd = HM.getPKLeft();
            if(cd <= 0)
            {
                this.lockGroup.visible = false;
                this.pkMV.visible = true
                this.pkMV.play(-1);
            }
            else
            {
                var max = HM.getPKCD();
                this.lockBar.width = 190 * (max - cd)/max;
                this.lockText.text = DateUtil.getStringBySecond(cd);
            }
        }

        var awardCD = TM.now() - HM.awardtime;
        if(!this.awardBtn.visible && HM.getAwardLeft() < 0)
        {
            this.awardBtn.visible = true;
            this.resetGiftPos();
        }
        if(!this.awardRed.visible && awardCD >= 3600*10)
            this.awardRed.visible = true;
        this.timeText.text = DateUtil.getStringBySecond(Math.min(3600*10,awardCD))

    }

    public renew(){
        var HM = HangManager.getInstance();
        this.titleText.text = '战役 '+(HM.level)+''


        var lastHistory = SharedObjectManager.getInstance().getMyValue('hang_video') || {};
        this.videoBtn2.visible = HM.level>= 10 && lastHistory.level === HM.level && lastHistory.fail >= 1
        if(lastHistory.level === HangManager.getInstance().level)
        {
            this.otherList = lastHistory.otherList;
            this.history = lastHistory.history;
        }
        else
        {
            this.otherList = null
            this.history = null
        }

        var showGift = HM.giftnum<HM.maxGiftNum && lastHistory.gift <= lastHistory.fail-1-lastHistory.gifttimes// && lastHistory.fail >= 2;
        if(showGift)
        {
            this.giftTW.setPaused(false)
            this.giftGroup.visible = true
        }
        else
        {
            this.giftTW.setPaused(true)
            this.giftGroup.visible = false
        }


        //this.bg.source = PKManager.getInstance().getBG(HangManager.getInstance().getHangBGID());

        //console.log('renew')




        this.callStop = false

        if(HM.level == 0)
        {
             this.openBtn.visible = true;
             this.clockGroup.visible = false;
             this.lockGroup.visible = false;
             this.awardBtn.visible = false;
             this.awardRed.visible = false;
            this.pkMV.visible = true
            this.pkMV.play(-1);
            this.pkMV.y = 280 - (500-this.height);
            this.reset(true);
            PKVideoCon.getInstance().x = (640- PKVideoCon.getInstance().width)/2;
        }
        else
        {
            this.openBtn.visible = false;
            this.clockGroup.visible = true;
            this.enemyForceText.text = '敌方战力：' + HM.getHangForce(HM.level+1);

            this.lockGroup.visible = HM.getPKLeft() > 0;
            this.awardBtn.visible = HM.getAwardLeft() < 0;
            this.resetGiftPos();
            this.awardRed.visible = false

            this.pkMV.visible = !this.lockGroup.visible
            this.pkMV.y = 460 - (500-this.height);
            if(this.pkMV.visible)
                this.pkMV.play(-1);
            else
                this.pkMV.stop();

            egret.Tween.removeTweens(this.guideGroup)
            this.guideGroup.visible = false
            if(this.pkMV.visible && HM.level <5)
            {
                egret.Tween.get(this.guideGroup,{loop:true}).wait(1000*10).call(()=>{
                    this.guideGroup.visible = true
                    this.pkMV.visible = false
                }).wait(1000*5).call(()=>{
                    this.guideGroup.visible = false
                    this.pkMV.visible = true
                })
            }

            var cd =  1000 -  (egret.getTimer() - this.initTime)
            clearTimeout(this.openTimer);
            if(cd > 0)
            {
                this.reset(true);
                this.openTimer = setTimeout(()=>{
                    if(this.stage)
                        this.renew();
                },cd)
                return;
            }

            var pkvideo = PKVideoCon.getInstance()
            if(pkvideo.parent != this.con)
                this.reset();
            //else
            //    console.log(pkvideo.parent)

            this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            //console.log('addListener')


        }



        this.onTimer();


    }

    //public addVideoCon(){
    //    var pkvideo = PKVideoCon.getInstance()
    //    this.con.addChild(pkvideo)
    //    pkvideo.y = -10;
    //    pkvideo.x = 0
    //}

    public stop(){
        this.callStop = true
        this.hideGift();
        clearTimeout(this.openTimer);
    }

    public hideGift(){
        this.giftTW.setPaused(true)
        this.giftGroup.visible = false;
    }

    public reset(stopStart?){
        //console.log('reset')

        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:UM.gameid,team:1,force:UM.tec_force,type:UM.type,hp:1},
                {id:2,gameid:'npc',team:2,force:UM.tec_force,type:UM.type,hp:1}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_MAIN_HANG
        PKBulletManager.getInstance().freeAll();
        var PD = PKData.getInstance();
        PD.init(data);
        PD.isReplay = true
        var pkvideo = PKVideoCon.getInstance();
        this.con.addChild(pkvideo)
        pkvideo.y = this.height-510;
        pkvideo.init();
        this.cost1 = 20
        this.cost2 = 20
        this.overCount = 0

        if(stopStart)
            return;

        PD.start();
        this.onStep()
    }

    public clean(){
        this.modeGroup.visible = false;
        var pkvideo = PKVideoCon.getInstance()
        if(pkvideo.parent == this.con)
        {
            //console.log('clean')
            egret.Tween.removeTweens(pkvideo)
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            //console.log('removeListener')
            PKBulletManager.getInstance().freeAll()
            pkvideo.remove();
            this.pkMV.stop();
            MyTool.removeMC(pkvideo);
        }
        clearTimeout(this.openTimer);
    }


    public onStep(){
        var PD = PKData.getInstance();
        var PC = PKCode.getInstance();
        var videoCon = PKVideoCon.getInstance();
        var cd = PD.getPassTime() - PD.actionTime
        if(cd > 1000*5)
        {
            this.reset();
            return;
        }
        while(cd > PKConfig.stepCD)
        {
            PD.actionTime += PKConfig.stepCD;
            cd -= PKConfig.stepCD;
            if(Math.floor(PD.actionTime/PKConfig.stepCD)%10 == 0)
                this.testAddMonster();

            PC.monsterAction();
            PC.monsterMove();
            PKMonsterAction.getInstance().actionAtk(PD.actionTime);//攻击落实
            PC.actionFinish();
        }
        videoCon.action();
        videoCon.randomTalk()
        if(PD.isGameOver ||  PD.actionTime > 90000 || (PD.actionTime > 3000 && PD.monsterList.length == 0))
        {
            this.overCount ++;
            if(this.overCount == 50)
            {
                if(this.callStop)
                {
                    this.clean();
                    return;
                }
                this.reset();
            }
            if(PD.isGameOver)
                return;
        }

        var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
        if(!item && PD.actionTime > 10*1000)
            item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.enemy.id);
        if(item)
        {
            var w = 640
            var scrollH = -(item.x - w/2);
            if(scrollH > 0)
                scrollH = 0;
            else if(scrollH < w - videoCon.width)
                scrollH = w - videoCon.width;
            var dec = Math.abs(videoCon.x - scrollH)
            var rote =  videoCon.x > scrollH ?1:-1
            if(dec > 80 || this.lastRota == rote)
            {
                egret.Tween.removeTweens(videoCon)
                if(dec > 10)
                {
                    var tw = egret.Tween.get(videoCon)
                    tw.to({x:scrollH},Math.min(300,dec*10))
                }
                else
                {
                    videoCon.x = scrollH;
                }
                this.lastRota = rote
            }

        }
    }

    private getTestID(){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            if(data[s].level != 999)
                arr.push(s)
        }
        //
        //var data = SkillVO.data;
        //for(var s in data)
        //{
        //    if(data[s].level != 999)
        //        arr.push(s)
        //}
        return ArrayUtil.randomOne(arr);
    }

    private testAddMonster(){
        if(this.cost1 > 0)
        {
            var id = <number>ArrayUtil.randomOne(CardManager.getInstance().getMyMonsterList(0)).id;
            while(id == 47)
                id = <number>ArrayUtil.randomOne(CardManager.getInstance().getMyMonsterList(0)).id;
            if(Config.isDebug && DM.testHangView)
            {
                id = this.getTestID();
            }
            var vo = MonsterVO.getObject(id)
            vo.preLoad();
            this.cost1 -= vo.cost
            this.addMonster(id,1)
        }

        if(this.cost2 > 0)
        {
            while(true)
            {
                var id = parseInt(ArrayUtil.randomOne(HangManager.getInstance().lastlist));   //敌人的出战列表，一定有
                if(id == 47)
                    continue;
                if(id < PKConfig.skillBeginID)
                    break;
            }
            if(Config.isDebug && DM.testHangView)
            {
                id = this.getTestID();
            }

            var vo = MonsterVO.getObject(id)
            vo.preLoad();
            this.cost2 -= vo.cost
            this.addMonster(id,2)
        }
    }

    private addMonster(id,ownerid){
        //if(!this.stage)
        //    return;
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(ownerid);
        var atkRota = owner.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        var oo = {
            force:owner.force,
            mid:id,
            owner:ownerid,
            atkRota:atkRota,
            x:x,
            level:DM.testHangView?5:HeroManager.getInstance().getHeroLevel(id),
            y:-25 + Math.random()*50,
            actionTime:PD.actionTime
        }
        PD.addMonster(oo);
    }

}