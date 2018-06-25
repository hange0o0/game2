class TecInfoUI extends game.BaseWindow {

    private static _instance: TecInfoUI;
    public static getInstance(): TecInfoUI {
        if(!this._instance)
            this._instance = new TecInfoUI();
        return this._instance;
    }
    private levelText: eui.Label;
    private mc: eui.Image;
    private desText: eui.Label;
    private upGroup: eui.Group;
    private icon1: eui.Image;
    private text1: eui.Label;
    private icon2: eui.Image;
    private text2: eui.Label;
    private list: eui.List;
    private nameText: eui.Label;
    private helpBtn: eui.Image;
    private btnGroup: eui.Group;
    public cancelBtn: eui.Button;
    public okBtn: eui.Button;




    public dataIn
    public dataArray = new eui.ArrayCollection()
    public constructor() {
        super();
        this.skinName = "TecInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)

        this.list.itemRenderer = TecInfoItem

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('tec')
        })

        this.list.dataProvider = this.dataArray
    }

    private onClick(){
        TecManager.getInstance().tec_up(this.dataIn.id,()=>{
            this.renew()
            GuideManager.getInstance().testShowGuide()
        });
    }

    public show(v?){
        this.dataIn = v;
        super.show()
    }

    public hide() {
        super.hide();
        GuideManager.getInstance().testShowGuide()
    }

    public onShow(){
        this.renew();

        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public showFinish(){
        GuideManager.getInstance().testShowGuide()
    }

    public renew(){

        var TCM = TecManager.getInstance();
        var lv = TCM.getLevel(this.dataIn.id);
        this.levelText.text = 'LV.' + lv;
        this.nameText.text = this.dataIn.name;
        this.mc.source = this.dataIn.getThumb();
        this.desText.text = this.dataIn.des
        switch(this.dataIn.type)
        {
            case 2:
                this.upGroup.visible = true
                this.icon1.source = 'icon_force2_png'
                this.icon2.source = 'icon_force2_png'
                this.text1.text = '+' + TCM.getForceAdd(this.dataIn.id,lv)
                this.text2.text = '+' + TCM.getForceAdd(this.dataIn.id,lv + 1)
                break;
            case 3:
                this.upGroup.visible = true
                this.icon1.source = 'icon_coin_png'
                this.icon2.source = 'icon_coin_png'
                this.text1.text = '+' + TCM.getCoinAdd(this.dataIn.id,lv)
                this.text2.text = '+' + TCM.getCoinAdd(this.dataIn.id,lv + 1)
                break;
            case 4:
                this.upGroup.visible = true
                this.icon1.source = PropVO.getObject(this.dataIn.id-300).getThumb()
                this.icon2.source = PropVO.getObject(this.dataIn.id-300).getThumb()
                this.text1.text = '+' + lv*5 + '%'
                this.text2.text = '+' +(lv+1)*5 + '%'
                break;
            default:
                this.upGroup.visible = false
                break;
        }

        var arr = TCM.getLevelUpCost(this.dataIn.id);
        this.dataArray.source = arr;
        this.dataArray.refresh()

        if(TCM.testRed(this.dataIn.id))
            this.btnGroup.addChild(this.okBtn);
        else
            MyTool.removeMC(this.okBtn);
    }
}