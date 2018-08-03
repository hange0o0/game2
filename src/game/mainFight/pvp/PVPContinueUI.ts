class PVPContinueUI extends game.BaseWindow {

    private static _instance:PVPContinueUI;

    public static getInstance():PVPContinueUI {
        if (!this._instance)
            this._instance = new PVPContinueUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PVPContinueUISkin";
        this.canBGClose = false;
    }

    private list: eui.List;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private hpText: eui.Label;
    private lvIcon: eui.Image;
    private lvText: eui.Label;
    private headMC: HeadMC;
    private cancelBtn: eui.Button;
    private pkBtn: eui.Button;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn, this.onPK)
        this.addBtnEvent(this.cancelBtn, this.onClose)

        this.list.itemRenderer = PosListHeadItem
        this.lvIcon.source = MyTool.getPropLevel()
    }

    private onPK(){
        PKBeforeUI.getInstance().show({
            title:'防御阵容对决',
            isAuto:true,
            otherList:PVPManager.getInstance().lastEnemyList,
            fun:function(id){
                PVPManager.getInstance().pkOffLineContinue(id)
            }
        })
    }

    public onShow(){
         this.renew();
    }

    private renew(){
        var player = PKData.getInstance().getPlayer(2);
        this.lvText.text = player.level ? 'LV.' + player.level:'???'
        this.hpText.text = player.hp

        this.nameText.text = player.nick
        this.headMC.setData(player.head,player.type)
        MyTool.setTypeImg(this.typeMC,player.type)


        PVPManager.getInstance().lastEnemyList = PKManager.getInstance().resetAutoList(player,PVPManager.getInstance().lastEnemyList)
        this.list.dataProvider = new eui.ArrayCollection(PVPManager.getInstance().lastEnemyList.split(','));
        console.log(PVPManager.getInstance().lastEnemyList)
    }

    private onClose(){
        PVPManager.getInstance().lastEnemyList = null;
        this.hide();
    }
}