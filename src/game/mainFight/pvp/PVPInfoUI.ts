class PVPInfoUI extends game.BaseUI {

    private static _instance:PVPInfoUI;

    public static getInstance():PVPInfoUI {
        if (!this._instance)
            this._instance = new PVPInfoUI();
        return this._instance;
    }


    public constructor() {
        super();
        this.skinName = "PVPInfoUISkin";
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private cdTitle: eui.Label;
    private cdText: eui.Label;
    private icon1: eui.Image;
    private titleGroup1: eui.Group;
    private con: eui.Group;
    private titleText1: eui.Label;
    private clickArea1: eui.Group;
    private expGroup1: eui.Group;
    private infoText1: eui.Label;
    private barMC1: eui.Rect;
    private rateText1: eui.Label;
    private pkBtn1: eui.Button;
    private pkBtn0: eui.Button;
    private awardList: eui.List;






    private getNextData = false
    private openTime

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn1, this.onOffline)
        this.addBtnEvent(this.pkBtn0, this.onOnline)

        this.topUI.setTitle('竞技场','pvp')
        this.bottomUI.setHide(this.hide,this);


        //this.addBtnEvent(this.clickArea1, this.onClick1)
        //this.addBtnEvent(this.clickArea0, this.onClick2)
        this.clickArea1.touchEnabled = true
        //this.clickArea0.touchEnabled = true

        this.awardList.itemRenderer = PVPInfoItem
        this.touchEnabled = false;
    }

    private onOffline(){
        PKBeforeUI.getInstance().show({
            title:'防御阵容对决',
            isAuto:true,
            isPVP:true,
            cardBase:{force:1000,type:UM.type},
            fun:function(id){
                PVPManager.getInstance().pkOffLine(id)
            }
        })
    }

    //private onClick1(){
    //    console.log(666)
    //    this.expGroup1.visible = !this.expGroup1.visible
    //}
    private onClick2(){
        //this.expGroup0.visible = ! this.expGroup0.visible
    }

    private onOnline(){
         MyWindow.ShowTips('暂未开放')
    }

    //private onHelp(){
    //    HelpManager.getInstance().showHelp('pvp')
    //}

    public show(){
        if(PVPManager.getInstance().nearEnd())
            return
        PVPManager.getInstance().getPVP(()=>{
            super.show()
        })
    }

    public onShow(){
        this.openTime = TM.now();
        //this.expGroup1.visible = false
        //this.expGroup0.visible = false
        this.getNextData = false
        this.renew();
        this.testRoundAward();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.pvp_change,this.renew)
    }

    private testRoundAward(){
        var PM = PVPManager.getInstance();
        if(PM.offline.award)
        {
            PM.getRoundAward('offline',()=>{
                this.testRoundAward()
            })
        }
        else if(PM.online.award)
        {
            PM.getRoundAward('online',()=>{
                this.testRoundAward()
            })
        }
    }

    private onTimer(){
        var PM = PVPManager.getInstance();
        if(PM.nearEnd())
        {
            this.hide();
            return
        }
        if(DateUtil.isSameDay(PM.getTime))
        {
            var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
            this.cdText.text = DateUtil.getStringBySecond(cd);
            this.cdTitle.text = '任务重置时间:'
        }
        else if(!this.getNextData)
        {
            this.getNextData = true
            PM.getPVP(()=>{
                this.renew()
                this.getNextData = false
            })
        }

        if(TM.now() - this.openTime >=6)
        {
            var cd = PM.getCurrentEnd() - TM.now()
            if(cd < 24*3600)
                this.cdText.text = DateUtil.getStringBySecond(cd);
            else
                this.cdText.text = DateUtil.getStringBySeconds(cd,false,2);
            this.cdTitle.text = '赛季结算时间:'
            if(TM.now() - this.openTime >= 6*2)
                this.openTime = TM.now();
        }
    }

    private renew(){
        this.con.layout['gap'] = (GameManager.stage.stageHeight - 730 - 210)/4
        this.renewOffline()
        //this.renewOnline()
        this.renewAward();
        this.onTimer();
    }

    private renewAward(){
        for(var i=0;i<PVPManager.getInstance().task.list.length;i++)
            PVPManager.getInstance().task.list[i].index = i;
        this.awardList.dataProvider = new eui.ArrayCollection(PVPManager.getInstance().task.list);
    }

    private renewOffline(){
        var PM = PVPManager.getInstance();
        var data = PM.offline;
        var score = data.score || 0
        var lv = PM.getLevel(score);
        var arr = [];
        arr.push(this.getText('段位等级','LV.' + lv))
        arr.push(this.getText('当前积分',data.score|| 0))
        arr.push(this.getText('历史最高',data.maxscore|| 0))
        arr.push(this.getText('对决场数',data.pknum|| 0))
        arr.push(this.getText('胜利场数',data.winnum|| 0))
        this.setHtml(this.infoText1,arr.join('\n'))

        this.icon1.source = 'pvp_icon_'+lv+'_png'
        this.titleText1.text = PM.base[lv].title + '竞技场'
        var s1 = PM.base[lv].score
        if(PM.base[lv+1])
        {
            var s2 = PM.base[lv+1].score
            var r0 = score - s1
            var r1 = s2 - s1
            this.rateText1.text = r0+'/'+r1
            this.barMC1.width = 180 * r0/r1;
        }
        else
        {
            this.barMC1.width = 180;
            this.rateText1.text = '已达最高段位'
        }
    }

    //private renewOnline(){
    //    var PM = PVPManager.getInstance();
    //    var data = PM.online;
    //    var score = data.score || 0
    //    var lv = PM.getLevel(score);
    //    var arr = [];
    //    arr.push(this.getText('段位等级','LV.' + lv))
    //    arr.push(this.getText('当前积分',data.score|| 0))
    //    arr.push(this.getText('历史最高',data.maxscore|| 0))
    //    arr.push(this.getText('对决场数',data.pknum|| 0))
    //    arr.push(this.getText('胜利场数',data.winnum|| 0))
    //    this.setHtml(this.infoText0,arr.join('\n'))
    //
    //    this.icon0.source = 'pvp_icon_1_png'
    //    this.titleText0.text = PM.base[lv].title + '竞技场'
    //    var s1 = PM.base[lv].score
    //    if(PM.base[lv+1])
    //    {
    //        var s2 = PM.base[lv+1].score
    //        var r0 = score - s1
    //        var r1 = s2 - s1
    //        this.rateText0.text = r0+'/'+r1
    //        this.barMC0.width = 240 * r0/r1;
    //    }
    //    else
    //    {
    //        this.barMC0.width = 240;
    //        this.rateText0.text = '已达最高段位'
    //    }
    //    MyTool.changeGray(this.icon0,true)
    //}

    private getText(title,value){
       return this.createHtml(title+'：',0x441A02)  + value;
    }
}