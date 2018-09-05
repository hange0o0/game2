class PKActiveMainPageUI extends game.BaseItem {

    private static _instance:PKActiveMainPageUI;
    public static getInstance():PKActiveMainPageUI {
        if (!this._instance)
            this._instance = new PKActiveMainPageUI();
        return this._instance;
    }

    private bg: eui.Image;
    private lockText: eui.Label;
    private pvpBtn: eui.Image;
    private activeMC: eui.Image;
    private activeBtn: eui.Group;
    private cdText: eui.Label;


    private bgTW
    private currentActive
    private nextActive
    public constructor() {
        super();
        this.skinName = "PKActiveMainPageUISkin";
        PKActiveMainPageUI._instance = this;
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.activeBtn,this.onActive)
        this.addBtnEvent(this.pvpBtn,this.onPVP)

        this.lockText.text = '战役'+Config.pvpLevel+' 解锁';

        this.bg.x = 0;
        this.bgTW = egret.Tween.get(this.bg,{loop:true}).to({x:-(this.bg.width-640)},3*60*1000)
    }

    public onVisibleChanged(b){
        this.bgTW.setPaused(!b);
    }

    public resetHeight(h){
        this.height = h;
    }

    private onActive(){
        if(this.currentActive)
            PKActiveUI.getInstance().show(this.currentActive);
    }
    private onPVP(){
        PVPInfoUI.getInstance().show();
    }

    public onTimer(){
        var t = TM.now();
        if(this.currentActive)
        {
            var cd = this.currentActive.end - t
            if(cd <=0)
            {
                this.renew()
                return;
            }
            this.renewCDText(cd);
        }
        else if(this.nextActive)
        {
            var cd = this.nextActive.start - t
            if(cd <=0)
            {
                this.renew()
                return;
            }
            this.renewCDText(cd);
        }
        else
        {
            this.cdText.text = '即将开放'
        }

    }

    private renewCDText(cd){
        if(cd > 3600*24)
            this.cdText.text = DateUtil.getStringBySeconds(cd,false,2)
        else
            this.cdText.text = DateUtil.getStringBySecond(cd)
    }

    public renew(){
        var PAM = PKActiveManager.getInstance()
        var lv = PVPManager.getInstance().getLevel(PAM.getPvpScore())
        this.pvpBtn.source = 'pvp_icon_'+lv+'_png'

        this.currentActive = PAM.getCurrentActive();
        this.nextActive = PAM.getNextActive();
        if(this.currentActive)
            this.activeMC.source = PAM.getActiveIcon(this.currentActive.type)
        else
            this.activeMC.source = PAM.getActiveIcon(0)

        this.onTimer();

    }
}