class HeroInfoUI extends game.BaseWindow {

    private static _instance: HeroInfoUI;
    public static getInstance(): HeroInfoUI {
        if(!this._instance)
            this._instance = new HeroInfoUI();
        return this._instance;
    }

    private item: PKHeroInfoUI;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private helpBtn: eui.Image;
    private r0: eui.RadioButton;
    private r1: eui.RadioButton;
    private closeBtn: eui.Image;








    public openList
    public data;
    public sp;
    public upAble = false;
    public constructor() {
        super();
        this.skinName = "HeroInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.r0,this.onCB)
        this.addBtnEvent(this.r1,this.onCB)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)
        this.addBtnEvent(this.closeBtn,this.hide)

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('hero')
        })

        //this.touchEnabled = false;
    }

    private onLeft(){
        var lastStat = this.currentState
        var index = this.openList.indexOf(this.data);
        this.data = this.openList[index-1];
        this.renew();
        if(this.currentState != lastStat)
            this.validateNow()
        PopUpManager.setMiddle(this);


    }
    private onRight(){
        var lastStat = this.currentState
        var index = this.openList.indexOf(this.data);
        this.data = this.openList[index+1];
        this.renew();
        if(this.currentState != lastStat)
            this.validateNow()
        PopUpManager.setMiddle(this);
    }





    private onCB(){
        SharedObjectManager.getInstance().setMyValue('show_card_base',this.r0.selected);
        this.renew();
    }

    public show(v?,sp?){
        this.data = v;
        this.sp = sp || {};
        super.show()
    }

    public hide() {
        super.hide();
        GuideManager.getInstance().testShowGuide()
    }

    public onShow(){
        if(this.sp.num)
            this.openList = [];
        else
            this.openList = HeroUI.getInstance().getCurrentList();
        this.r0.selected = SharedObjectManager.getInstance().getMyValue('show_card_base') || false;
        this.r1.selected = !this.r0.selected
        this.renew();
    }


    public renew(){
        var lv = HeroManager.getInstance().getHeroLevel(this.data.id)
        if(this.sp.force)
        {
            this.item.renew({
                mid:this.data.id,
                sp:this.sp,
                level:this.sp.level || 1,
                force:this.sp.force,
                isView:true
            });
            if(this.currentState != 'view')
                this.currentState = 'view'
            return;
        }
        else if(this.r0.selected)
        {
            this.item.renew({
                mid:this.data.id,
                sp:this.sp,
                force:0,
                level:lv
            });
        }
        else
        {
            this.item.renew({
                mid:this.data.id,
                force:UM.tec_force,
                sp:this.sp,
                level:lv
            });
        }



        if(this.currentState != 'normal')
            this.currentState = 'normal'
        var index = this.openList.indexOf(this.data);
        this.leftBtn.visible = index > 0
        this.rightBtn.visible = index < this.openList.length - 1;
        this.validateNow();
    }


}