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
    private type1Text: eui.Label;
    private type2Text: eui.Label;
    private type3Text: eui.Label;
    private forceText: eui.Label;
    private spaceText: eui.Label;
    private typeGroup: eui.Group;
    private tg1: eui.Group;
    private tg2: eui.Group;
    private tg3: eui.Group;







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
            this.x = 170
        else
            this.x = 0


        this.resetList();
        this.y = PKingUI.getInstance().displayY;
        this.minHeight = GameManager.stage.stageHeight - this.y - 150;
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
        //this.bottom = GameManager.stage.stageHeight - Math.max(this.xy.y-10,this.height)
    }

    private renewNum(){
        var PD = PKData.getInstance();
        this.spaceText.text = '' + PD.getMonsterSpaceByPlayer(this.playerData.id) + '/' + PKConfig.maxMonsterSpace;
        this.typeGroup.removeChildren();
        var arr = [
            {type:1,num:PD.getMonsterByPlayer(this.playerData.id,1).length},
            {type:2,num:PD.getMonsterByPlayer(this.playerData.id,2).length},
            {type:3,num:PD.getMonsterByPlayer(this.playerData.id,3).length}
        ]
        ArrayUtil.sortByField(arr,['num','type'],[1,0])
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.num)
            {
                this.typeGroup.addChild(this['tg' + oo.type])
                this['type'+oo.type+'Text'].text = PKConfig.TYPENAME[oo.type] + ' ×' + oo.num;
            }
        }
        //this.type1Text.text = PKConfig.TYPENAME[1] + '×' + ;
        //this.type2Text.text = PKConfig.TYPENAME[2] + '×' + PD.getMonsterByPlayer(this.playerData.id,2).length
        //this.type3Text.text = PKConfig.TYPENAME[3] + '×' + PD.getMonsterByPlayer(this.playerData.id,3).length

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