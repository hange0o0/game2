class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static getInstance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }

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

        this.b0.data = {text:'奴隶',index:0,source:'main_slave_png'}
        this.b1.data = {text:'背包',index:1,source:'main_bag_png'}
        this.b2.data = {text:'战斗',index:2,source:'main_pk_png'}
        this.b3.data = {text:'卡牌',index:3,source:'main_card_png'}
        this.b4.data = {text:'科技',index:4,source:'main_tec_png'}
        this.bottomItems.push(this.b0)
        this.bottomItems.push(this.b1)
        this.bottomItems.push(this.b2)
        this.bottomItems.push(this.b3)
        this.bottomItems.push(this.b4)
    }

    private onAddForce(){

    }

    private onAddEnergy(){

    }

    private onAddDiamond(){

    }


    public onBottomSelect(index){
       if(index != this.currentIndex)
       {
           var t = egret.getTimer();
           this.bottomItems[this.currentIndex].select(false)
           this.bottomItems[index].select(true)
           this.currentIndex = index;

           egret.Tween.removeTweens(this.bottomSelectMC)
           var tw = egret.Tween.get(this.bottomSelectMC)
           var bottomX = this.getBottomX()
           tw.to({x:bottomX},200)

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
           console.log(egret.getTimer() - t)
       }
    }


    public setTopPos(scrollV){
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

        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.diamond_change,this.renewTop)
        this.addPanelOpenEvent(GameEvent.client.energy_change,this.renewEnergy)
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
         if(this.currentIndex = 2)
         {
             if(this.visible)
                 MainFightUI.getInstance().onPKEnd()
             else
                 MainFightUI.getInstance().onPKBegin()
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
}