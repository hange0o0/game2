class SlaveAddProUI extends game.BaseWindow {

    private static _instance: SlaveAddProUI;
    public static getInstance(): SlaveAddProUI {
        if(!this._instance)
            this._instance = new SlaveAddProUI();
        return this._instance;
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private titleText: eui.Label;
    private numInput: CommonNumInput;
    private costDiamondText: eui.Label;
    private ownDiamondText: eui.Label;
    private addDiamondBtn1: eui.Image;
    private desText: eui.Label;





    private openid
    private lastTime
    public constructor() {
        super();
        this.skinName = "SlaveAddProUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.addDiamondBtn1,this.onDiamond)

        this.numInput.addEventListener(CommonNumInput.RENEW,this.renewCoin,this);
    }

    private onDiamond(){

    }

    private renewCoin() {
        var hour = this.numInput.nowNum;
        var diamond =  this.getDiamondByHour(hour);
        this.costDiamondText.text = diamond + ''
        this.costDiamondText.textColor =  UM.diamond < diamond?0xFF0000:0xffffff
    }

    private onClick(){
        var hour = this.numInput.nowNum;
          var diamond =  this.getDiamondByHour(hour);
        if(!UM.testDiamond(diamond))
            return;
        SlaveManager.getInstance().slave_addprotect(this.openid,hour,()=>{
            this.hide();
        })
    }

    public getDiamondByHour(hour){
        var begin = Math.max(0,this.lastTime - TM.now());
        begin = Math.round(begin/3600);
        var count = 3 + begin;
        for(var i=1;i<hour;i++)
        {
            count += 3+i + begin;
        }
        return count
    }

    public show(v?,lastTime?){
        this.lastTime = lastTime || 0;
        this.openid = v;
        //SlaveManager.getInstance().slave_miss(()=>{
            super.show();
        //})
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        var cd = this.lastTime - TM.now();
        if(cd > 0)
        {
            if(cd < 3600*24)
                this.desText.text = '当前保护剩余时间：' + DateUtil.getStringBySecond(cd) + '\n请选择你需要增加的保护小时数:'
            else
                this.desText.text = '当前保护剩余时间：' + DateUtil.getStringBySeconds(cd,false,2)  + '\n请选择你需要增加的保护小时数:'
        }
        else
        {
            this.desText.text = '请选择你需要增加的保护小时数:'
        }

    }

    public renew(){
        this.ownDiamondText.text = UM.diamond + ''
        this.numInput.nowNum = 1;
        this.onTimer();
        this.renewCoin();
    }
}