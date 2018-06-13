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
    private selfIcon: eui.Image;
    private type: eui.Image;
    private nameText: eui.Label;
    private forceText: eui.Label;
    private spaceText: eui.Label;






    public playerData:PKPlayerData
    public renewFlag = false

    private xy

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
                this.addItem(data);
                break;
            case PKConfig.VIDEO_MONSTER_DIE:
                this.removeItem(data);
                break;
            case PKConfig.VIDEO_MONSTER_HPCHANGE:
                this.renewFlag = true;
                break;
        }
    }

    public onTimer(){
        if(!this.visible)
            return;
        this.renewFlag && this.renewList()
    }

    public hide(){
        this.visible = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.hide,this)
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)
    }

    public show(playerData,xy?){
        this.xy = xy;
        this.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this)
        this.stage.once(egret.TouchEvent.TOUCH_CANCEL,this.hide,this)

        this.visible = true;
        this.playerData = playerData;

        this.type.source = 'icon_type'+playerData.type+'_png'
        this.nameText.text = playerData.nick;
        this.forceText.text = '' + playerData.force + ''
        this.selfIcon.visible = playerData == PKData.getInstance().myPlayer;

        if(this.playerData.teamData.atkRota == PKConfig.ROTA_LEFT)
            this.x = 10
        else
            this.x = 160

        this.resetList();
        this.renewFlag = false;
    }

    public resetList(){
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
        this.renewNum();
        this.renewBottom();
    }

    private addItem(data){
        var arr = <eui.ArrayCollection>(this.list.dataProvider);
        arr.addItem(data);
        this.renewNum();
        this.renewBottom();
    }

    private removeItem(data){
        var arr = <eui.ArrayCollection>(this.list.dataProvider);
        var index = arr.getItemIndex(data);
        arr.removeItemAt(index);
        this.renewNum();
        this.renewBottom();
    }

    private renewBottom(){
        this.bottom = GameManager.stage.stageHeight - Math.max(this.xy.y-10,this.height)
    }

    private renewNum(){
        var PD = PKData.getInstance();
        this.spaceText.text = '' + PD.getMonsterSpaceByPlayer(this.playerData.id) + '/' + PKConfig.maxMonsterSpace
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