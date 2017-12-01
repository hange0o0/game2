class PKTopUI extends game.BaseContainer {

    private group1: eui.Group;
    private hpText1: eui.Label;
    private defScoreGroup1: eui.Group;
    private defGroupText1: eui.Label;
    private defGroup1: eui.Group;
    private defText1: eui.Label;
    private group2: eui.Group;
    private defGroup2: eui.Group;
    private defText2: eui.Label;
    private defScoreGroup2: eui.Group;
    private defGroupText2: eui.Label;
    private hpText2: eui.Label;
    private topUI: TopUI;



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
            case PKConfig.VIDEO_POS_ADD:
                var teamData = data.getOwner().teamData
                if(teamData.id != 'sys' && teamData != PKData.getInstance().myPlayer.teamData)
                    this.addSkillItem(data);
                break;
            case PKConfig.VIDEO_MONSTER_WIN:
                this.renewHp();
                break;
            case PKConfig.VIDEO_TEAM_DEF:
                this.def1(videoData.user);
                break;
            case PKConfig.VIDEO_TEAM_DEF2:
                this.def2();
                break;
        }
    }


    private createItem():PKTopItem{
        var item:PKTopItem = this.itempool.pop();
        if(!item)
        {
            item = new PKTopItem();
            item.y = 66;
        }
        return item;
    }

    private freeItem(item){
        if(!item)
            return;
        item.remove();
        this.itempool.push(item);

    }

    public init(title){
        this.topUI.setTitle(title);
        if(GameManager.stage.stageHeight > 1050)
            this.y = 0
        else
            this.y = -55;

        this.renewHp()
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }

        MyTool.removeMC(this.defGroup1)
        MyTool.removeMC(this.defGroup2)
        this.group1.addChild(this.defScoreGroup1)
        this.group2.addChildAt(this.defScoreGroup2,0)
        this.defGroupText1.text = '0'
        this.defGroupText2.text = '0'
    }

    public renewHp(){
        var PD = PKData.getInstance();
        var team1 = PD.getTeamByRota(PKConfig.ROTA_LEFT);
        var team2 = PD.getTeamByRota(PKConfig.ROTA_RIGHT);
        this.hpText1.text = team1.hp + ''// + team1.maxhp + ' 增加防御:' + team1.def
        this.hpText2.text = team2.hp + ''// + team2.maxhp   //  ' 增加防御:' + team2.def + ' '+
    }

    public def1(user){
        var team = user.getOwner().teamData;
       if(team.atkRota == PKConfig.ROTA_LEFT)
       {
           var txt = this.defGroupText1
       }
        else
       {
           var txt = this.defGroupText2
       }
        txt.text = '+' + team.def;
        egret.Tween.removeTweens(txt);
        txt.scaleX = txt.scaleY = 1.3;
        var tw = egret.Tween.get(txt);
        tw.to({scaleX:1,scaleY:1},200);
    }
    public def2(){
        var PD = PKData.getInstance();
        MyTool.removeMC(this.defScoreGroup1)
        MyTool.removeMC(this.defScoreGroup2)
        this.group1.addChild(this.defGroup1)
        this.group2.addChildAt(this.defGroup2,0)
        this.defText1.text = '+' +  Math.floor(PD.getTeamByRota(PKConfig.ROTA_LEFT).def/10) + '%'
        this.defText2.text = '+' +  Math.floor(PD.getTeamByRota(PKConfig.ROTA_RIGHT).def/10)  + '%'
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
        return 16 + index*88
    }



}