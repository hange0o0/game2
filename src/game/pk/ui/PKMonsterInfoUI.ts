class PKMonsterInfoUI extends game.BaseContainer {
    private static instance:PKMonsterInfoUI;
    public static getInstance() {
        return this.instance;
    }

    public constructor() {
        super();
        PKMonsterInfoUI.instance = this;
        this.skinName = "PKMonsterInfoSkin";
    }

    private list: eui.List;


    public playerData:PKPlayerData
    public resetFlag = false
    public renewFlag = false

    public childrenCreated() {
        super.childrenCreated();
        this.hide();
        this.list.itemRenderer = PKMonsterInfoItem;
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }
    public onVideoEvent(e){
        if(!this.visible)
            return;
        var videoData = e.data;
        var data:PKMonsterData = videoData.user;
        if(data.owner != this.playerData.id)
            return;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_MONSTER_DIE:
                this.resetFlag = true;
                break;
            case PKConfig.VIDEO_MONSTER_BEATK:
                this.renewFlag = true;
                break;
        }
    }

    public onTimer(){
        if(!this.visible)
            return;
        this.resetFlag && this.resetList()
        this.renewFlag && this.renewList()
    }

    public hide(){
        this.visible = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.hide,this)
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)
    }

    public show(playerData){
        this.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this)
        this.stage.once(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)

        this.visible = true;
        this.playerData = playerData;

        if(this.playerData.teamData.atkRota == PKConfig.ROTA_LEFT)
            this.x = 10;
        else
            this.x = 640-460-10;

        this.resetList();
        this.renewFlag = false;
    }

    public resetList(){
        this.resetFlag = false;
        var PD = PKData.getInstance();
        var arr = [];
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i]
            if(mvo.owner != this.playerData.id)
                continue;
            arr.push(mvo);
        }
        this.list.dataProvider = new eui.ArrayCollection(arr);
    }

    public renewList(){
        this.renewFlag = false;
         for(var i=0;i<this.list.numChildren;i++)
         {
             var item:any = this.list.getChildAt(i);
             item.onTimer();
         }
    }
}