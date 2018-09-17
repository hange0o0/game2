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
    private videoBtn: eui.Group;



    private lastSeed;
    private player;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.pkBtn, this.onPK)
        this.addBtnEvent(this.headMC, this.onHead)
        this.addBtnEvent(this.cancelBtn, this.onClose)
        this.addBtnEvent(this.videoBtn,this.onVideo)

        this.list.itemRenderer = PosListHeadClickItem
        this.lvIcon.source = MyTool.getPropLevel()
    }

    private onVideo(){
        PKHistoryUI.getInstance().show(PVPManager.getInstance().history);
    }

    private onHead(){
        if(this.player.gameid != 'npc')
            OtherInfoUI.getInstance().show(this.player.gameid)
    }

    private onPK(){
        var self = this;
        PKBeforeUI.getInstance().show({
            title:'防御阵容对决',
            isAuto:true,
            cardBase:{force:1000,type:UM.type},
            otherList:PVPManager.getInstance().lastEnemyList,
            history:PVPManager.getInstance().history,
            fun:function(id){
                PVPManager.getInstance().pkOffLineContinue(id,self.lastSeed)
            }
        })
    }

    public show(){
        if(PVPManager.getInstance().nearEnd())
            return
        super.show();
    }

    public onShow(){
         this.renew();
        this.addPanelOpenEvent(GameEvent.client.PVP_END,this.hide)
    }

    private renew(){
        this.lastSeed = PKData.getInstance().baseData.seed
        var player = this.player = PKData.getInstance().getPlayer(2);
        if(player.level)
            this.lvText.text = 'LV.' + player.level;
        else
        {
            var card = player.autolist.split(',')
            var level = 0;
            for(var i=0;i<card.length;i++)
            {
                level = Math.max(CM.getCardVO(card[i]).level,level)
            }
            this.lvText.text = 'LV.' + Math.max(level,UM.level);
        }

        this.hpText.text = player.hp

        this.nameText.text = player.nick
        this.headMC.setData(player.head,player.type)
        MyTool.setTypeImg(this.typeMC,player.type)


        PVPManager.getInstance().lastEnemyList = PKManager.getInstance().resetAutoList(player,PVPManager.getInstance().lastEnemyList)
        this.list.dataProvider = new eui.ArrayCollection(CardManager.getInstance().resetOtherList(PVPManager.getInstance().lastEnemyList));

        if(!PVPManager.getInstance().history)
            PVPManager.getInstance().history = [];
        PVPManager.getInstance().history.unshift(PKManager.getInstance().recordList[0])
    }

    private onClose(){
        PVPManager.getInstance().lastEnemyList = null;
        PVPManager.getInstance().history = null;
        this.hide();
    }
}