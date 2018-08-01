class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static getInstance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }
    private bg: eui.Image;
    private con: eui.Group;
    private topCon: eui.Group;
    private addCoinBtn: eui.Image;
    private coinText: eui.Label;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;
    private bottomSelectMC: eui.Image;
    private b0: MainBottomBtn;
    private b1: MainBottomBtn;
    private b2: MainBottomBtn;
    private b3: MainBottomBtn;
    private b4: MainBottomBtn;








    public hideTopState = false
    public currentIndex = 2
    public bottomItems = []
    public currentUI:MainBase;
    public lastUI:MainBase;
    public constructor() {
        super();
        this.skinName = "MainUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.addCoinBtn, this.onAddCoin)
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy)
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamond)

        this.b0.data = {text:'英雄',index:0,source:'main_hero_png',type:'hero'}
        this.b1.data = {text:'奴隶',index:1,source:'main_slave_png',type:'slave'}
        this.b2.data = {text:'战斗',index:2,source:'main_pk_png',type:'main'}
        this.b3.data = {text:'卡牌',index:3,source:'main_card_png',type:'card'}
        this.b4.data = {text:'科技',index:4,source:'main_tec_png',type:'tec'}
        this.bottomItems.push(this.b0)
        this.bottomItems.push(this.b1)
        this.bottomItems.push(this.b2)
        this.bottomItems.push(this.b3)
        this.bottomItems.push(this.b4)

        if(egret.Capabilities.renderMode == 'webgl')
        {
            var blurFliter = new egret.BlurFilter( 10 , 10);
            this.bg.filters = [blurFliter];
        }
        this.bg.cacheAsBitmap  = true;

        if(_get['app'])
        {
            this.addDiamondBtn.visible = false;
        }
    }

    private onAddCoin(){
        this.onBottomSelect(4);
        TecUI.getInstance().setTab(2)
    }

    private onAddEnergy(){
         ShopUI.getInstance().show();
    }

    private onAddDiamond(){
        ShopUI.getInstance().show(true);
    }


    private renewBGX(mv?){
       var toX = -this.currentIndex * 70 - 20;
        egret.Tween.removeTweens(this.bg)
        if(mv)
        {
            var tw = egret.Tween.get(this.bg)
            tw.to({x:toX},350,egret.Ease.sineOut)
        }
        else
        {
            this.bg.x = toX;
        }


    }

    public onBottomSelect(index,stopMV?){
       if(index != this.currentIndex)
       {
           if(index == 0)
           {
               MyWindow.Alert('英雄系统即将开放')
               return;
           }
           if(index == 1 && ObjectUtil.objLength(PosManager.getInstance().defList) == 0)//奴隶
           {
               MyWindow.Alert('请先设置防守阵容',()=>{
                   BasePosUI.getInstance().show('def',0,{fun:()=>{
                       if(ObjectUtil.objLength(PosManager.getInstance().defList))
                            this.onBottomSelect(index,true)
                   }});
               });
               return;
           }

           var cd = stopMV?0:350
           SoundManager.getInstance().playEffect(SoundConfig.effect_button);
           var t = egret.getTimer();
           this.bottomItems[this.currentIndex].select(false)
           this.bottomItems[index].select(true)
           this.currentIndex = index;

           egret.Tween.removeTweens(this.bottomSelectMC)
           var tw = egret.Tween.get(this.bottomSelectMC)
           var bottomX = this.getBottomX()
           tw.to({x:bottomX},cd,egret.Ease.sineOut)

           this.renewBGX(true);

           if(this.lastUI)
               this.lastUI.hide();
           this.lastUI = this.currentUI
           this.setCurrentUI();
           var rota = 1;
           if(this.bottomSelectMC.x > bottomX)
               rota = -1
           if(this.lastUI)
               this.lastUI.x = 0
           this.currentUI.x = 640*rota;
           egret.Tween.removeTweens(this.con)
           var tw = egret.Tween.get(this.con)
           tw.to({x:-640*rota},cd,egret.Ease.sineOut).call(function(){
               this.con.x = 0
               this.currentUI.x = 0
               if(this.lastUI)
               {
                   this.lastUI.hide()
                   this.lastUI = null;
               }
               if(!stopMV)
                     this.runUIShowFinish();
               else
               {
                   this.once(egret.Event.ENTER_FRAME,this.runUIShowFinish,this)
               }
           },this)
           this.setTopPos(0);
       }
    }

    private runUIShowFinish(){
        this.currentUI.showFinish && this.currentUI.showFinish();
    }


    public setTopPos(scrollV){
        this.bg.y = - scrollV
        if(this.hideTopState)
        {
            if(scrollV >= 30)
                return;
        }
        else if(scrollV <= 50)
            return;

        this.hideTopState = !this.hideTopState
        egret.Tween.removeTweens(this.topCon)
        var tw = egret.Tween.get(this.topCon)
        if(this.hideTopState)
            tw.to({y:-50},Math.abs(this.topCon.y - (-50))*4)
        else
            tw.to({y:20},Math.abs(this.topCon.y - (20))*4)
    }



    public show(){
        //先初始化，加快切换速度
        MainFightUI.getInstance()
        SlaveUI.getInstance()
        //BagUI.getInstance()
        CardUI.getInstance()
        TecUI.getInstance()

        //GuideManager.getInstance().isGuiding = true;

        if(GuideManager.getInstance().isGuiding)
            this.LoadFiles = ['guide']


        super.show()
    }

    public hide() {
        super.hide();
    }

    private onHangChange(){
        this.bg.source = PKManager.getInstance().getBG(HangManager.getInstance().getHangBGID());
    }

    public onShow(){
        this.onHangChange();
        //this.bg.source = Config.localResRoot  + 'main_bg'+UM.type+'.jpg';
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renewEnergy)
        this.addPanelOpenEvent(GameEvent.client.hang_change,this.onHangChange)

        //GuideManager.getInstance().isGuiding = true;
        if(GuideManager.getInstance().isGuiding)
        {
            GuideManager.getInstance().guideStep = 0;
            GuideManager.getInstance().reInit();
            GuideManager.getInstance().showGuide()
        }
        else if(!LoginManager.getInstance().logText.cb && LoginManager.getInstance().logText.text)
            LogUI.getInstance().show();

        SoundManager.getInstance().playSound(SoundConfig.bg);

        setTimeout(function(){
            SoundManager.getInstance().loadEffectSound();
        },1000)
    }

    private onTimer(){
        this.renewEnergy();
        this.renewCoin();
    }

    public renewTop(){
        this.diamondText.text = UM.diamond + ''
    }

    private renewCoin(){
        var coin = UM.getCoin();
        if(coin < 0)
        {
             this.setHtml(this.coinText,this.createHtml('偿还供奉中...',0xFF9999,22))
        }
        else
        {
            this.coinText.text = NumberUtil.addNumSeparator(Math.max(UM.getCoin(),0),3);
        }

    }

    public renewEnergy(){
        var energy = UM.getEnergy();
        if(energy)
            this.energyText.text = energy + '/' + UM.maxEnergy;
        else
            this.setHtml(this.energyText,this.createHtml(DateUtil.getStringBySecond(UM.getNextEnergyCD()).substr(-5),0xFF0000));
    }

    public onVisibleChange(){
         if(this.currentIndex == 2)
         {
             MainFightUI.getInstance().onVisibleChange(this.visible)
         }
    }

    public renew(){
        this.renewTop();
        this.renewEnergy();
        this.renewCoin();

        for(var i=0;i<this.bottomItems.length;i++)
        {
            this.bottomItems[i].select(this.currentIndex == i,false)
        }
        this.bottomSelectMC.x = this.getBottomX()
        this.renewBGX(false);

        if(this.lastUI)
            this.lastUI.hide();
        if(this.currentUI)
            this.currentUI.hide();
        this.setCurrentUI();
        egret.Tween.removeTweens(this.con)
        this.currentUI.x = 0
        this.con.x = 0
    }


    public setCurrentUI(){
        switch(this.currentIndex)
        {
            case 1:
                this.currentUI = SlaveUI.getInstance();
                break;
            //case 0:
            //    this.currentUI = BagUI.getInstance();
            //    break;
            case 2:
                this.currentUI = MainFightUI.getInstance();
                break;
            case 3:
                this.currentUI = CardUI.getInstance();
                break;
            case 4:
                this.currentUI = TecUI.getInstance();
                break;
        }
        this.currentUI.show(this.con)

    }

    private getBottomX(){
        return this.currentIndex*110
    }

    public renewRed(){
        for(var i=0;i<this.bottomItems.length;i++)
        {
            this.bottomItems[i].renewRed();
        }
    }
}