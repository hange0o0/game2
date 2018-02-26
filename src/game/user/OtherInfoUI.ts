class OtherInfoUI extends game.BaseUI {
    private static _instance: OtherInfoUI;
    public static getInstance(): OtherInfoUI {
        if(!this._instance)
            this._instance = new OtherInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "OtherInfoUISkin";
    }

    private scroller: eui.Scroller;
    private headMC: HeadMC;
    private nameText: eui.Label;
    private infoList: eui.List;
    private cardList: eui.List;
    private list: eui.List;
    private bottomUI: BottomUI;
    private okBtn: eui.Button;
    private viewBtn: eui.Button;





    private gameid;
    private master;
    private isMyMaster;

    private dataArray = new eui.ArrayCollection()

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.hide,this);

        //this.scroller.viewport = this.list;
        this.list.itemRenderer = InfoItem

        this.cardList.itemRenderer = PosListHeadItem
        this.cardList.dataProvider = this.dataArray

        this.addBtnEvent(this.okBtn,this.onPK)
        this.addBtnEvent(this.viewBtn,this.onView)
    }

    private onView(){
        var SM =  SlaveManager.getInstance()
        if(SM.viewObj[this.gameid])
        {
            var str = '确定取消对该玩家的关注吗？'
            MyWindow.Confirm(str,(b)=>{
                if(b==1)
                {
                    SlaveManager.getInstance().deleteView(this.gameid,()=>{
                        this.viewBtn.label = '关注';
                    })
                }
            })
        }
        else
        {
             var len  = ObjectUtil.objLength(SM.viewObj);
            if(len >= SM.maxViewNum)
            {
                MyWindow.Alert('你的关注列表已达上限\n无法关注该玩家')
                return;
            }
            else
            {
                SlaveManager.getInstance().addView(this.gameid,()=>{

                    this.viewBtn.label = '取消\n关注';
                    MyWindow.ShowTips('关注成功！')
                })
            }
        }
    }

    private onPK(){
        var gameid = this.gameid
        var master = this.master
        var self = this
        var proCD = InfoManager.getInstance().otherInfo[this.gameid].protime - TM.now()
        if(proCD < 3600*24)
            var proStr  = DateUtil.getStringBySecond(proCD)
         else
            var proStr = DateUtil.getStringBySeconds(proCD,false,2)
        if(this.isMyMaster)
        {
            if(proCD > 0)
            {
                MyWindow.Alert('当前保护时间剩余' + proStr + '\n无法反抗你的主人')
                return;
            }
            PKBeforeUI.getInstance().show({
                fun:function(id){
                    SlaveManager.getInstance().slave_pk_begin(UM.gameid,gameid,id)
                }
            })
        }
        else if(this.master == UM.gameid)
        {
            var str = '确定要释放该奴隶吗？'
            if(proCD > 0)
            {
                str += '\n当前保护时间还剩余' + proStr;
            }
            MyWindow.Confirm(str,(b)=>{
                if(b==1)
                {
                    SlaveManager.getInstance().slave_delete(gameid)
                }
            })
        }
        else
        {
            if(proCD > 0)
            {
                MyWindow.Alert('当前保护时间剩余' + proStr + '\n无法收服其作为你的奴隶')
                return;
            }
            if(PosManager.getInstance().defList.length == 0)
            {
                MyWindow.Alert('请先设置防守阵容',()=>{
                    BasePosUI.getInstance().show('def',0);
                });
                return;
            }
            PKBeforeUI.getInstance().show({
                fun:function(id){
                    SlaveManager.getInstance().slave_pk_begin(gameid,master,id)
                }
            })
        }


    }

    public show(gameid?){
        this.gameid = gameid;
        SlaveManager.getInstance().viewList(()=>{
            InfoManager.getInstance().getInfo(gameid,()=>{
                super.show()
            })
        })

    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.info_change,this.regetInfo)
    }

    private regetInfo(){
        delete InfoManager.getInstance().otherInfo[this.gameid]
        InfoManager.getInstance().getInfo(this.gameid,()=>{
            this.renew()
        })
    }

    public renew(){
        this.isMyMaster = false
        var data = InfoManager.getInstance().otherInfo[this.gameid]
        var slave = InfoManager.getInstance().otherSlave[this.gameid];
        this.nameText.text = '' + data.nick;

        var infoArr = [
            {title:'主城等级：',value:'LV.' + (data.level||1)},
            {title:'召唤战力：',value:data.tec_force},
            {title:'金币产出：',value:data.hourcoin + '/小时'}
        ];
        if(data.protime > TM.now())
        {
            var cd = data.protime - TM.now();
                if(cd < 3600*24)
                    var str  = DateUtil.getStringBySecond(cd)
                else
                    var str = DateUtil.getStringBySeconds(cd,false,2)
            infoArr.push({title:'保护时间：',value:str})
        }

        this.infoList.dataProvider = new eui.ArrayCollection(infoArr)
        //this.coinText.text = '产出：' + data.hourcoin + '/小时';
        //this.forceText.text = '战力：'  + data.tec_force;
        this.headMC.setData(data.head,data.type);

        var slaveList = slave.slave.concat();


        this.master = this.gameid;
        if(slave.master)
        {
            slaveList.unshift(slave.master)
            this.master = slave.master.gameid;
            if(this.master == UM.gameid) //同步自己信息
            {
                slave.master.head = UM.head
                slave.master.tec_force = UM.tec_force
                slave.master.hourcoin = UM.hourcoin
            }
        }
        this.list.dataProvider = new eui.ArrayCollection(slaveList)

        for(var i=0;i<slaveList.length;i++)
        {
             if(slaveList[i].gameid == UM.gameid && this.master != UM.gameid)
             {
                 this.isMyMaster = true;

                 // //同步自己信息
                 slaveList[i].head = UM.head
                 slaveList[i].tec_force = UM.tec_force
                 slaveList[i].hourcoin = UM.hourcoin
                 break;
             }
        }
        if(this.isMyMaster)
            this.okBtn.label = '反抗';
        else
            this.okBtn.label = this.master == UM.gameid?'释放\n奴隶':'收服\n奴隶'

        this.viewBtn.label = SlaveManager.getInstance().viewObj[this.gameid]?'取消\n关注':'关注';

        if(data.last_card)
        {
            var list = data.last_card.split(',');
            this.dataArray.source = list;
        }
        else
        {
            this.dataArray.source = [];
        }
        this.dataArray.refresh()

    }
}