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
    private openBtn: eui.Button;
    private awardRed: eui.Image;
    private helpBtn: eui.Image;







    //private monsterArr = []
    private cost1 = 0
    private cost2 = 0
    private overCount = 10


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




        var pkvideo = PKVideoCon.getInstance()
        this.con.addChild(pkvideo)
        pkvideo.y = -120;
        pkvideo.x = 0

        if(HM.level == 0)
        {
             this.openBtn.visible = true;
             this.clockGroup.visible = false;
             this.lockGroup.visible = false;
             this.awardBtn.visible = false;
             this.awardRed.visible = false;
            this.reset(true);
            PKVideoCon.getInstance().x = (628- PKVideoCon.getInstance().width)/2;
        }
        else
        {
            this.openBtn.visible = false;
            this.clockGroup.visible = true;
            this.addEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            this.reset();

            this.lockGroup.visible = HM.getPKLeft() > 0;
            this.awardBtn.visible = HM.getAwardLeft() < 0;
            this.awardRed.visible = false
        }

        this.onTimer();


    }

    public reset(stopStart?){
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:UM.gameid,team:1,force:UM.tec_force,type:UM.type,hp:1},
                {id:2,gameid:'npc',team:2,force:UM.tec_force,type:UM.type,hp:1}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_MAIN_HANG
        var PD = PKData.getInstance();
        PD.init(data);
        PD.currentState = 'pk'
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
            egret.Tween.removeTweens(pkvideo)
            this.removeEventListener(egret.Event.ENTER_FRAME,this.onStep,this)
            PKBulletManager.getInstance().freeAll()
            pkvideo.remove();
        }
    }


    public onStep(){
        var PD = PKData.getInstance();
        var PC = PKCode.getInstance();
        var videoCon = PKVideoCon.getInstance();
        var cd = PD.getPassTime() - PD.actionTime
        if(cd > 1000*3)
        {
            this.reset();
            return;
        }
        while(cd > PKConfig.stepCD)
        {
            PD.actionTime += PKConfig.stepCD;
            cd -= PKConfig.stepCD;
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
                this.reset();
            if(PD.isGameOver)
                return;
        }

        var item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.id);
        if(!item && PD.actionTime > 10*1000)
            item = PKData.getInstance().getFirstItem(PKData.getInstance().myPlayer.teamData.enemy.id);
        if(item)
        {
            var w = 628
            var scrollH = -(item.x - w/2);
            if(scrollH > 0)
                scrollH = 0;
            else if(scrollH < w - videoCon.width)
                scrollH = w - videoCon.width;
            var dec = Math.abs(videoCon.x - scrollH)
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
                if(id < 100)
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