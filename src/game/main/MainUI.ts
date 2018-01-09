class MainUI extends game.BaseUI {

    private static _instance: MainUI;
    public static getInstance(): MainUI {
        if(!this._instance)
            this._instance = new MainUI();
        return this._instance;
    }

    private con: eui.Group;
    private bottomSelectMC: eui.Rect;
    private b0: MainBottomBtn;
    private b1: MainBottomBtn;
    private b2: MainBottomBtn;
    private b3: MainBottomBtn;
    private b4: MainBottomBtn;





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

    public onBottomSelect(index){
       if(index != this.currentIndex)
       {
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
       }
    }




    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }

    public renew(){
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