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
    private upGroup2: eui.Group;
    private icon1_2: eui.Image;
    private text1_2: eui.Label;
    private icon2_2: eui.Image;
    private text2_2: eui.Label;
    private list: eui.List;
    private nameText: eui.Label;
    private helpBtn: eui.Image;
    private btnGroup: eui.Group;
    public cancelBtn: eui.Button;
    public okBtn: eui.Button;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;





    public openList
    public dataIn
    private upStr
    public dataArray = new eui.ArrayCollection()
    public constructor() {
        super();
        this.skinName = "TecInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn,this.hide)
        this.addBtnEvent(this.okBtn,this.onClick)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)

        this.list.itemRenderer = TecInfoItem

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('tec')
        })

        this.list.dataProvider = this.dataArray
    }

    private onLeft(){
        var index = this.openList.indexOf(this.dataIn);
        this.dataIn = this.openList[index-1];
        this.renew();
    }
    private onRight(){
        var index = this.openList.indexOf(this.dataIn);
        this.dataIn = this.openList[index+1];
        this.renew();
    }

    private onClick(){
        TecManager.getInstance().tec_up(this.dataIn.id,()=>{
            MyWindow.ShowTips('升级成功！'+this.upStr)
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
        this.openList =  TecManager.getInstance().getListByType(this.dataIn.type);
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
        this.upGroup2.visible = false
        switch(this.dataIn.type)
        {
            case 1:
                if(this.dataIn.id == 1)
                {
                    this.upGroup.visible = false
                    this.upStr = '科技等级 +1'
                }
                else
                {
                    this.upGroup.visible = true
                    var icon
                    if(this.dataIn.id == 2)
                    {
                        this.text1.text = '' + TCM.getHp()
                        this.text2.text = '' + (TCM.getHp() + 1)
                        icon = 'icon_love_png'
                        this.upStr = '队伍生命 +1'
                    }
                    else if(this.dataIn.id == 3)
                    {
                        this.text1.text = '' + SlaveManager.getInstance().getCurrentMax()
                        this.text2.text = '' + (SlaveManager.getInstance().getCurrentMax() + 1)
                        icon = 'tec_slave_icon_png'
                        this.upStr = '奴隶上限 +1'
                    }
                    else if(this.dataIn.id == 4)
                    {
                        this.text1.text = '' + PosManager.getInstance().maxPosNum()
                        this.text2.text = '' + (PosManager.getInstance().maxPosNum() + 1)
                        icon = 'icon_card_png'
                        this.upStr = '阵容上限 +1'
                    }
                    this.icon1.source = icon
                    this.icon2.source = icon

                }

                break;
            case 2:
                this.upGroup.visible = true
                this.icon1.source = 'icon_force2_png'
                this.icon2.source = 'icon_force2_png'
                this.text1.text = '+' + TCM.getForceAdd(this.dataIn.id,lv)
                this.text2.text = '+' + TCM.getForceAdd(this.dataIn.id,lv + 1)
                this.upStr = '战力 +'  + (TCM.getForceAdd(this.dataIn.id,lv + 1) - TCM.getForceAdd(this.dataIn.id,lv))
                break;
            case 3:
                this.upGroup.visible = true
                this.icon1.source = 'icon_coin_png'
                this.icon2.source = 'icon_coin_png'
                this.text1.text = '+' + TCM.getCoinAdd(this.dataIn.id,lv)
                this.text2.text = '+' + TCM.getCoinAdd(this.dataIn.id,lv + 1)
                this.upStr = '每小时金币 +'  + (TCM.getCoinAdd(this.dataIn.id,lv + 1) - TCM.getCoinAdd(this.dataIn.id,lv))
                break;
            case 4:
                this.upGroup.visible = true
                this.upGroup2.visible = true
                this.icon1.source = PropVO.getObject(this.dataIn.id-300).getThumb()
                this.icon2.source = PropVO.getObject(this.dataIn.id-300).getThumb()
                this.text1.text = '+' + lv*5 + '%'
                this.text2.text = '+' +(lv+1)*5 + '%'
                this.text1_2.text = '+' + MyTool.toFixed(lv*0.2,1) + '%'
                this.text2_2.text = '+' +MyTool.toFixed((lv+1)*0.2,1) + '%'
                this.upStr = PropVO.getObject(this.dataIn.id-300).propname + '获取 +5%，金币 +0.2%'
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

        var index = this.openList.indexOf(this.dataIn);
        this.leftBtn.visible = index > 0
        this.rightBtn.visible = index < this.openList.length - 1;
    }
}