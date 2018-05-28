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
    private forceText: eui.Label;
    private addForceBtn: eui.Image;
    private energyText: eui.Label;
    private addEnergyBtn: eui.Image;
    private diamondText: eui.Label;
    private addDiamondBtn: eui.Image;
    private bottomSelectMC: eui.Rect;
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

        this.addBtnEvent(this.addForceBtn, this.onAddForce)
        this.addBtnEvent(this.addEnergyBtn, this.onAddEnergy)
        this.addBtnEvent(this.addDiamondBtn, this.onAddDiamond)

        this.b0.data = {text:'奴隶',index:0,source:'main_slave_png',type:'slave'}
        this.b1.data = {text:'背包',index:1,source:'main_bag_png',type:'bag'}
        this.b2.data = {text:'战斗',index:2,source:'main_pk_png',type:'main'}
        this.b3.data = {text:'卡牌',index:3,source:'main_card_png',type:'card'}
        this.b4.data = {text:'科技',index:4,source:'main_tec_png',type:'tec'}
        this.bottomItems.push(this.b0)
        this.bottomItems.push(this.b1)
        this.bottomItems.push(this.b2)
        this.bottomItems.push(this.b3)
        this.bottomItems.push(this.b4)

        var blurFliter = new egret.BlurFilter( 10 , 10);
        this.bg.filters = [blurFliter];
        this.bg.cacheAsBitmap  = true;
    }

    private onAddForce(){
        this.onBottomSelect(4);
        TecUI.getInstance().setTab(1)
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
            tw.to({x:toX},200)
        }
        else
        {
            this.bg.x = toX;
        }


    }

    public onBottomSelect(index){
       if(index != this.currentIndex)
       {
           if(index == 0 && ObjectUtil.objLength(PosManager.getInstance().defList) == 0)//奴隶
           {
               MyWindow.Alert('请先设置防守阵容',()=>{
                   BasePosUI.getInstance().show('def',0);
               });
               return;
           }

           SoundManager.getInstance().playEffect(SoundConfig.effect_button);
           var t = egret.getTimer();
           this.bottomItems[this.currentIndex].select(false)
           this.bottomItems[index].select(true)
           this.currentIndex = index;

           egret.Tween.removeTweens(this.bottomSelectMC)
           var tw = egret.Tween.get(this.bottomSelectMC)
           var bottomX = this.getBottomX()
           tw.to({x:bottomX},200)

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
           tw.to({x:-640*rota},200).call(function(){
               this.con.x = 0
               this.currentUI.x = 0
               if(this.lastUI)
               {
                   this.lastUI.hide()
                   this.lastUI = null;
               }
           },this)
           this.setTopPos(0);
       }
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
        BagUI.getInstance()
        CardUI.getInstance()
        TecUI.getInstance()

        //GuideManager.getInstance().isGuiding = true;

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
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewTop)
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
    }

    public renewTop(){
        this.forceText.text = UM.tec_force + ''
        this.diamondText.text = UM.diamond + ''
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
            case 0:
                this.currentUI = SlaveUI.getInstance();
                break;
            case 1:
                this.currentUI = BagUI.getInstance();
                break;
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