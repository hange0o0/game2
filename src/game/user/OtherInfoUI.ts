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
    }

    private onPK(){
        var gameid = this.gameid
        var master = this.master
        var self = this
        if(this.isMyMaster)
        {
            PKBeforeUI.getInstance().show({
                fun:function(id){
                    SlaveManager.getInstance().slave_pk_begin(UM.gameid,gameid,id)
                }
            })
        }
        else if(this.master == UM.gameid)
        {
            MyWindow.Confirm('确定要释放该奴隶吗？',(b)=>{
                if(b==1)
                {
                    SlaveManager.getInstance().slave_delete(gameid)
                }
            })
        }
        else
        {
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
        InfoManager.getInstance().getInfo(gameid,()=>{
            super.show()
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

        this.infoList.dataProvider = new eui.ArrayCollection([
            {title:'召唤战力：',value:data.tec_force},
            {title:'金币产出：',value:data.hourcoin + '/小时'}

        ])
        //this.coinText.text = '产出：' + data.hourcoin + '/小时';
        //this.forceText.text = '战力：'  + data.tec_force;
        this.headMC.setData(data.head,data.type);

        var slaveList = slave.slave.concat();


        this.master = this.gameid;
        if(slave.master)
        {
            slaveList.unshift(slave.master)
            this.master = slave.master;
        }
        this.list.dataProvider = new eui.ArrayCollection(slaveList)

        for(var i=0;i<slaveList.length;i++)
        {
             if(slaveList[i].gameid == UM.gameid)
             {
                 this.isMyMaster = true;
                 break;
             }
        }
        if(this.isMyMaster)
            this.okBtn.label = '反抗';
        else
            this.okBtn.label = this.master == UM.gameid?'释放\n奴隶':'收服\n奴隶'

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