class PKTopUI extends game.BaseContainer {

    private infoText: eui.Label;
    private hpText1: eui.Label;
    private hpText2: eui.Label;

    public itemArr = []
    public itempool = []
    public constructor() {
        super();

        this.skinName = "PKTopSkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }
    public onVideoEvent(e){
        var item:PKMonsterItem;
        var videoData = e.data;
        var data:PKMonsterData = videoData.user;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
                var teamData = data.getOwner().teamData
                if(teamData.id != 'sys' && teamData != PKData.getInstance().myPlayer.teamData)
                    this.addSkillItem(data);
                break;
            case PKConfig.VIDEO_MONSTER_WIN:
                this.renewHp();
                break;
            case PKConfig.VIDEO_TEAM_DEF:
                this.renewHp();
                break;
        }
    }


    private createItem():PKTopItem{
        var item:PKTopItem = this.itempool.pop();
        if(!item)
        {
            item = new PKTopItem();
            item.y = 40;
        }
        return item;
    }

    private freeItem(item){
        if(!item)
            return;
        item.remove();
        this.itempool.push(item);

    }

    public init(){
         this.renewHp()
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }
    }

    public renewHp(){
        var PD = PKData.getInstance();
        var team1 = PD.getTeamByRota(PKConfig.ROTA_LEFT);
        var team2 = PD.getTeamByRota(PKConfig.ROTA_RIGHT);
        this.hpText1.text = team1.hp + '/' + team1.maxhp + ' def:' + team1.def
        this.hpText2.text = ' def:' + team2.def + ' '+team2.hp + '/' + team2.maxhp
    }

    public addSkillItem(data){
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item:PKTopItem = this.itemArr[i];
            var targetX = this.getX(i+1);
            egret.Tween.removeTweens(item)
            var tw = egret.Tween.get(item)
            tw.to({x:targetX},Math.abs(item.x - targetX)*2)
            if(targetX >= this.getX(8))
            {
                item.disAppear();
            }

            if(item.removeAble)
            {
                this.itemArr.splice(i,1);
                this.freeItem(item)
                i--;
            }
        }
        var item = this.createItem();
        this.itemArr.unshift(item)
        item.x = this.getX(0);
        this.addChild(item);
        item.data = data;
        item.appear()


    }

    private getX(index){
        return 19 + index*76
    }



}