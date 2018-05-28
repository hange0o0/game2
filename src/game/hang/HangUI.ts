class HangUI extends game.BaseItem {

    private static _instance: HangUI;
    public static getInstance(): HangUI {
        if(!this._instance)
            this._instance = new HangUI();
        return this._instance;
    }

    private con: eui.Group;
    //private bg: eui.Image;
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








    //private monsterArr = []
    private cost1 = 0
    private cost2 = 0
    private overCount = 10

    private initTime
    private openTimer
    private lastRota = 0

    private pkMV;
    private callStop = true;

    public constructor() {
        super();
        this.skinName = "HangUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onPK)
        this.addBtnEvent(this.awardBtn,this.onAward)

        this.addBtnEvent(this.helpBtn,(e)=>{
            e.stopImmediatePropagation()
            HelpManager.getInstance().showHelp('hang')
        })

        this.con.mask = new egret.Rectangle(0,0,this.con.width,this.con.height)

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
    }

    public onPK(){
        if(this.lockGroup.visible)
            return;
        PKBeforeUI.getInstance().show({
            title:'挂机PK',
            fun:function(id){
                HangManager.getInstance().pk(id)
            }
        })
    }

    public onAward(e){
         e.stopImmediatePropagation()
        HangManager.getInstance().award(()=>{
            this.awardBtn.visible = false
            this.awardRed.visible = false
            this.onTimer();
        })
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
            this.awardBtn.visible = true;
        if(!this.awardRed.visible && awardCD >= 3600*10)
            this.awardRed.visible = true;
        this.timeText.text = DateUtil.getStringBySecond(Math.min(3600*10,awardCD))

    }

    public renew(){
        var HM = HangManager.getInstance();
        this.titleText.text = '第 '+(HM.level+1)+' 关'

        //this.bg.source = PKManager.getInstance().getBG(HangManager.getInstance().getHangBGID());

        console.log('renew')



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
            this.pkMV.y = 280;
            this.reset(true);
            PKVideoCon.getInstance().x = (640- PKVideoCon.getInstance().width)/2;
        }
        else
        {
            this.openBtn.visible = false;
            this.clockGroup.visible = true;

            this.lockGroup.visible = HM.getPKLeft() > 0;
            this.awardBtn.visible = HM.getAwardLeft() < 0;
            this.awardRed.visible = false

            this.pkMV.visible = !this.lockGroup.visible
            this.pkMV.y = 460;
            if(this.pkMV.visible)
                this.pkMV.play(-1);
            else
                this.pkMV.stop();

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
            else
                console.log(pkvideo.parent)

            this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            console.log('addListener')


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
    }

    public reset(stopStart?){
        console.log('reset')

        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:UM.gameid,team:1,force:UM.tec_force,type:UM.type,hp:1},
                {id:2,gameid:'npc',team:2,force:UM.tec_force,type:UM.type,hp:1}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_MAIN_HANG
        PKBulletManager.getInstance().freeAll()
        var PD = PKData.getInstance();
        PD.init(data);
        PD.isReplay = true
        var pkvideo = PKVideoCon.getInstance()
        this.con.addChild(pkvideo)
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
        var pkvideo = PKVideoCon.getInstance()
        if(pkvideo.parent == this.con)
        {
            console.log('clean')
            egret.Tween.removeTweens(pkvideo)
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            console.log('removeListener')
            PKBulletManager.getInstance().freeAll()
            pkvideo.remove();
            this.pkMV.stop();
            MyTool.removeMC(pkvideo);
        }
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
        if(PD.isGameOver || PD.monsterList.length == 0 || PD.actionTime > 180000)
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

    private testAddMonster(){
        if(this.cost1 > 0)
        {
            var id = <number>ArrayUtil.randomOne(CardManager.getInstance().getMyMonsterList(0)).id;
            var vo = MonsterVO.getObject(id)
            vo.preLoad();
            this.cost1 -= vo.cost
            this.addMonster(id,1)
        }

        if(this.cost2 > 0)
        {
            while(true)
            {
                var id = parseInt(ArrayUtil.randomOne(HangManager.getInstance().lastlist));
                if(id < PKConfig.skillBeginID)
                    break;
            }

            var vo = MonsterVO.getObject(id)
            vo.preLoad();
            this.cost2 -= vo.cost
            this.addMonster(id,2)
        }
    }

    private addMonster(id,ownerid){
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
            y:-25 + Math.random()*50,
            actionTime:PD.actionTime
        }
        PD.addMonster(oo);
    }

}