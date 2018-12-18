class MainFightUI extends MainBase {

    private static _instance:MainFightUI;

    public static getInstance():MainFightUI {
        if(!this._instance)
            this._instance = new MainFightUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    public mapBtn: HangUI;
    public forceGroup: eui.Group;
    private forceText: eui.Label;
    private forceRedMC: eui.Image;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    private rankBtn: eui.Group;
    private mailBtn: eui.Group;
    private mailRed: eui.Image;
    private settingBtn: eui.Group;
    private activeUI: PKActiveMainPageUI;
    private defBtn: eui.Group;
    private atkBtn: eui.Group;

    public taskGroup: eui.Group;
    private taskText: eui.Label;
    private taskResultText: eui.Label;
    private taskIcon: eui.Image;
    private taskFinishMC: eui.Image;
    private firstBtn: eui.Group;











    private hideTopState
    private taskVO
    private giftTW
    private stopAlertTask

    public constructor() {
        super();
        this.skinName = "MainFightUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.defBtn, this.onDef)
        this.addBtnEvent(this.atkBtn, this.onAtk)

        this.addBtnEvent(this.forceGroup, this.onAddForce)

        this.addBtnEvent(this.mailBtn, this.onMail)
        this.addBtnEvent(this.rankBtn, this.onRank)
        this.addBtnEvent(this.shopBtn, this.onShop)
        this.addBtnEvent(this.settingBtn, this.onSetting)
        this.addBtnEvent(this.firstBtn, ()=>{
            FirstPayUI.getInstance().show();
        })

        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)

        EM.addEvent(GameEvent.client.pk_begin,this.onPKBegin,this)
        EM.addEvent(GameEvent.client.pk_end,this.onPKEnd,this)

        var h = GameManager.stage.stageHeight-140-110
        var mapH = Math.min(500,Math.max(430,h*0.6))
        this.mapBtn.resetHeight(mapH)
        this.activeUI.resetHeight(Math.max(380,h-mapH))

        this.taskGroup.visible = false;
        this.addBtnEvent(this.taskGroup, this.onTask)

        var tw = this.giftTW = egret.Tween.get(this.taskFinishMC,{loop:true});
        var bs = 0.5
        tw.to({scaleX:1.1*bs,scaleY:0.8*bs},200).to({scaleX:1*bs,scaleY:1.1*bs,y:this.taskFinishMC.y -15},200).
            to({scaleX:1.1*bs,scaleY:0.8*bs,y:this.taskFinishMC.y},200).to({scaleX:1*bs,scaleY:1*bs},300).wait(2000);
        this.giftTW.setPaused(true)

        //this.defBtn.visible = false
        //this.atkBtn.visible = false

    }

    private onTask(){
        if(this.taskVO.isFinish())
        {
            TaskManager.getInstance().getTaskAward(this.taskVO.id);
        }
        else
            this.taskVO.onClick();
    }

    private onAddForce(){
        MainUI.getInstance().onBottomSelect(4,GuideManager.getInstance().isGuiding);
        TecUI.getInstance().setTab(1)
    }

    private renewRed(){
        this.mailRed.visible = MailManager.getInstance().getNotAwardNum() > 0;
        this.forceRedMC.visible = TecManager.getInstance().isForceRed()
        this.shopRedMC.visible = PayManager.getInstance().isRed()
    }




    //public setTopPos(scrollV){
    //    if(this.hideTopState)
    //    {
    //        if(scrollV >= 30)
    //            return;
    //    }
    //    else if(scrollV <= 50)
    //        return;
    //
    //    this.hideTopState = !this.hideTopState
    //    egret.Tween.removeTweens(this.bottomGroup)
    //    var tw = egret.Tween.get(this.bottomGroup)
    //    if(this.hideTopState)
    //        tw.to({bottom:-130},Math.abs(this.bottomGroup.bottom - (-130))*2)
    //    else
    //        tw.to({bottom:25},Math.abs(this.bottomGroup.bottom - (25))*2)
    //}

    private onScroll(){
        MainUI.getInstance().setTopPos(this.scroller.viewport.scrollV)
        //this.setTopPos(this.scroller.viewport.scrollV)
    }

    private onTest(){
        HangManager.getInstance().pkTest(PosManager.getInstance().atkList[0].id)
    }

    private onMail(){
         MailUI.getInstance().show();
    }
    private onRank(){
        RankUI.getInstance().show();
    }
    private onShop(){
         ShopUI.getInstance().show();
    }
    private onSetting(){
        SettingUI.getInstance().show()

        //MainUI.getInstance().hide();
        //LoginUI.getInstance().show();
    }

    private onDef(){
        BasePosUI.getInstance().show('def');
    }

    private onAtk(){
        BasePosUI.getInstance().show('atk');
    }



    //private onMap(){
    //    HangUI.getInstance().show();
    //}

    public onShow(){
        GuideManager.getInstance().enableScrollV(this.scroller);
        this.stopAlertTask = true
        this.renew();
        this.renewForce();
        this.renewRed();
        this.onFirstChange();
        this.stopAlertTask = false

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
        this.addPanelOpenEvent(GameEvent.client.red_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.coin_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.prop_change,this.renewRed)
        this.addPanelOpenEvent(GameEvent.client.force_change,this.renewForce)
        this.addPanelOpenEvent(GameEvent.client.hang_change,this.onHangChange)
        this.addPanelOpenEvent(GameEvent.client.pvp_change,this.onPVPChange)
        this.addPanelOpenEvent(GameEvent.client.first_change,this.onFirstChange)

        EM.addEvent(GameEvent.client.task_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.tec_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.slave_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.card_change,this.renewTask,this);
        EM.addEvent(GameEvent.client.active_change,this.renewTask,this);
    }

    private onFirstChange(){
        this.firstBtn.visible = !ActiveManager.getInstance().first_pay
    }

    private onHangChange(){
         this.renewActive();
        this.renewTask();
    }
    private onPVPChange(){
        this.renewActive();
        this.renewTask();
    }

    private renewActive(){
        if(HangManager.getInstance().level >= Config.pvpLevel)
        {
            PKActiveManager.getInstance().getActive(()=>{
                this.activeUI.renew()
            })
        }
        else
        {
            this.activeUI.renew();
        }
    }

    private renewForce(){
        this.forceText.text = UM.tec_force + ''
        this.renewTask();
    }

    public onPKBegin(){
        this.mapBtn.clean()
    }
    public onPKEnd(){
        if(this.stage && MainUI.getInstance().visible)
            this.mapBtn.renew()

        //this.fightBtn.renew();
        //this.pvpBtn.renew();
    }


    private onTimer(){
        this.mapBtn.onTimer()
        this.activeUI.onTimer()
    }

    public onVisibleChange(b){
        this.activeUI.onVisibleChanged(b)
        if(b)
        {
            this.renewHang();

        }
        else
        {
            this.mapBtn.stop()
        }
    }



    public renew(){
        //egret.Tween.removeTweens(this.bottomGroup)
        //this.bottomGroup.bottom = 25
        this.scroller.viewport.scrollV = 0;
        this.renewHang();
        this.renewActive();

        //this.fightBtn.renew();
        //this.pvpBtn.renew();
    }

    public renewHang(){
        this.mapBtn.renew();
    }
    public hide(){
        super.hide()
        this.mapBtn.stop()
    }

    public renewTask(){
        if(GuideManager.getInstance().isGuiding)
        {
            this.taskGroup.visible = false;
            return;
        }


        var arr = TaskManager.getInstance().getCurrentTaskList();
        if(arr.length == 0)
        {
            this.taskGroup.visible = false;
            return;
        }

        var count = 0;
        this.taskGroup.visible = true;
        //this.list.dataProvider = new eui.ArrayCollection(arr)
        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            if(item.isFinish())
            {
                if(!TaskManager.getInstance().lastFinishStat[item.id])
                {
                    if(!this.stopAlertTask)
                        MyWindow.ShowTips('任务：【'+item.getDes().replace(']','').replace('[','') + '】 已完成',2000);
                    TaskManager.getInstance().lastFinishStat[item.id] = true;
                    TaskManager.getInstance().nowAction = null;
                }
                count ++;
            }
        }

        var vo = this.taskVO = arr[0];
        MyTool.setColorText(this.taskText,vo.getDes(),'#ffff33');
        if(vo.isFinish())
        {
            this.taskResultText.text =  '已完成'
            this.taskResultText.textColor =  0xFFFF00
        }
        else
        {
            this.taskResultText.text =  vo.getRate()
            this.taskResultText.textColor =  0xE0A44A
        }
        this.taskFinishMC.visible = count > 0;
        this.taskIcon.visible = !this.taskFinishMC.visible;
        this.giftTW.setPaused(this.taskIcon.visible)
    }
}