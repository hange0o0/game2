class SlaveItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveItemSkin";
    }

    private headMC: HeadMC;
    private lockText: eui.Label;
    private getBtn: eui.Button;
    private coinText: eui.Label;
    private redMC: eui.Image;
    private clickArea: eui.Group;
    private cdGroup: eui.Group;
    private cdText: eui.Label;
    private typeMC: eui.Image;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.getBtn,this.onGet)
        //this.addBtnEvent(this.getAllBtn,this.onGetAllClick)
        this.addBtnEvent(this.clickArea,this.onInfo)
    }

    private onClick(){
        if(this.data.empty)
        {
            SlaveChooseUI.getInstance().show()
        }
        else if(this.data.lock)
        {
            TecInfoUI.getInstance().show(TecVO.getObject(3));
        }
    }
    private onInfo(){
        OtherInfoUI.getInstance().show(this.data.gameid);
    }
    private onGet(e){
        if(this.currentState == 'normal')
        {
            var cd = TM.now() - this.data.awardtime;
            if(cd < 3600)
            {
                MyWindow.Alert('暂无可领取供奉！');
                return;
            }
            SlaveManager.getInstance().slave_award([this.data.gameid],()=>{
                 this.onTimer();
            })
        }
        else if(this.currentState == 'master')
        {
            var gameid = this.data.gameid
            var master = this.data.master
            PKBeforeUI.getInstance().show({
                fun:function(id){
                    SlaveManager.getInstance().slave_pk_begin(gameid,master,id)
                }
            })
        }
    }

    private onGetAllClick(e){
        var list =  SlaveManager.getInstance().getAwardList();
        if(list.length == 0)
            return;
        SlaveManager.getInstance().slave_award(list,()=>{

        })
    }

    public onTimer(){
         if(this.currentState == 'normal')
         {
             var cd = Math.min(3600*10,TM.now() - this.data.awardtime)
             //MyTool.changeGray(this.getBtn,cd < 60*60,true)
             this.redMC.visible = cd == 3600*10;
             this.getBtn.label = '收取 '+Math.floor(cd/3600)+'/10'
             this.getBtn.skinName = cd >= 3600?'Btn1Skin':'Btn2Skin'

             cd = this.data.protime - TM.now()
             if(cd > 0)
             {
                 this.cdText.text = DateUtil.getStringBySecond(cd);
                 this.cdGroup.visible = true;
             }
             else
             {
                 this.cdGroup.visible = false;
             }
         }
         //else if(this.currentState == 'master')
         //{
         //    var cd = this.data.protime - TM.now()
         //    if(cd > 0)
         //    {
         //        this.cdText.text = DateUtil.getStringBySecond(cd);
         //        MyTool.changeGray(this.getBtn,cd < 60*60,true)
         //        this.cdGroup.visible = true;
         //    }
         //    else
         //    {
         //        this.cdGroup.visible = false;
         //    }
         //}
    }

    public dataChanged(){
        if(this.data.pos)
        {
            this.currentState = 'pos'
        }
        else if(this.data.empty)
        {
            this.currentState = 'empty'
        }
        else if(this.data.lock)
        {
            this.currentState = 'lock'
            this.lockText.text = '点击开启'
        }
        else if(this.data.btn)
        {
            this.currentState = 'btn'
        }
        else if(this.data.title)
        {
            this.currentState = 'title'
            //this.titleText.text = this.data.title
        }
        else
        {
            if(this.data.isMaster)
            {
                this.currentState = 'master'
                this.coinText.text = '战力：'  + this.data.tec_force;
            }
            else
            {
                this.currentState = 'normal'
                this.coinText.text = '时产：' + NumberUtil.formatStrNum(this.data.hourcoin) + '';
            }

            //this.nameText.text = '' + this.data.nick;
            this.headMC.setData(this.data.head,this.data.type);
            MyTool.setTypeImg(this.typeMC,this.data.type)
            //this.type.source = 'icon_type' + this.data.type + '_png'
            this.onTimer();
        }

    }

}