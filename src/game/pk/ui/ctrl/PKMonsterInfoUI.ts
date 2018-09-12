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

    private nameText: eui.Label;
    private typeGroup: eui.Group;
    private t1: PKMonsterInfoItem;
    private t2: PKMonsterInfoItem;
    private t3: PKMonsterInfoItem;
    private forceText: eui.Label;
    private totalText: eui.Label;








    public playerData:PKPlayerData

    private xy

    public childrenCreated() {
        super.childrenCreated();
        this.hide();
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }
    public onVideoEvent(e){
        if(!this.visible)
            return;
        var videoData = e.data;
        var data:PKMonsterData = videoData.user;
        if(!data || data.owner != this.playerData.id) //user不一定有
            return;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_MONSTER_DIE:
                this.renew();
                break;
        }
    }

    public onTimer(){
        if(!this.visible)
            return;
        //this.renewFlag && this.renewList()
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

        //this.type.source = 'icon_type'+playerData.type+'_png'
        this.nameText.text = playerData.nick;
        this.forceText.text = '' + playerData.force + ''
        //this.selfIcon.visible = playerData == PKData.getInstance().myPlayer;

        //if(this.playerData.teamData.atkRota == PKConfig.ROTA_LEFT)
        //    this.x = 150
        //else
            this.x = 100


        this.renew();
        this.y = (PKingUI.getInstance().displayCon-320)/2 + PKingUI.getInstance().displayY//GameManager.stage.stageHeight - 470//this.xy.y + 50
    }

    public renew(){
        var PD = PKData.getInstance();
        var arr = [
            {type:1,self:this.playerData.type,s1:0,s2:0,total:0,max:0},
            {type:2,self:this.playerData.type,s1:0,s2:0,total:0,max:0},
            {type:3,self:this.playerData.type,s1:0,s2:0,total:0,max:0}
        ];
        var total = 0;
        var max = 0;
        for(var i=0;i<PD.monsterList.length;i++)
        {
            var mvo:PKMonsterData = PD.monsterList[i]
            if(mvo.owner != this.playerData.id)
                continue;

            var vo = mvo.getVO()
            var type = vo.type;
            total += vo.space;
            if(!type)
                continue;
            var oo = arr[type-1];
            if(mvo.dieTime)
                oo.s2 += vo.space
            else
                oo.s1 += vo.space
            max = Math.max(max,oo.s1+oo.s2)

        }
        for(var i=0;i<arr.length;i++)
        {
            var mc = this['t' + (i+1)]
            var data = arr[i];
            data.total = total;
            data.max = max;
            mc.data = data;
        }

        this.totalText.text = '总体积：' + total + '/' + PKConfig.maxMonsterSpace;
    }
}