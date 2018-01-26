class OtherInfoUI extends game.BaseWindow {
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

    private nameText: eui.Label;
    private type: eui.Image;
    private coinText: eui.Label;
    private forceText: eui.Label;
    private cancelBtn: eui.Button;
    private okBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;


    private gameid;
    private master;
    private isMyMaster;

    public childrenCreated() {
        super.childrenCreated();


        this.scroller.viewport = this.list;
        this.list.itemRenderer = InfoItem

        this.addBtnEvent(this.cancelBtn,this.hide)
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
        this.coinText.text = '产出：' + data.hourcoin + '/小时';
        this.forceText.text = '战力：'  + data.tec_force;
        this.type.source = 'icon_type' + data.type + '_png'

        this.list.dataProvider = new eui.ArrayCollection(slave)
        this.master = this.gameid;
        if(slave[0] && slave[0].gameid == this.gameid && slave[0].master)
            this.master = slave[0].master;

        for(var i=0;i<slave.length;i++)
        {
             if(slave[i].gameid == UM.gameid)
             {
                 this.isMyMaster = true;
                 break;
             }
        }
        if(this.isMyMaster)
            this.okBtn.label = '反抗';
        else
            this.okBtn.label = this.master == UM.gameid?'释放奴隶':'收服奴隶'
    }
}