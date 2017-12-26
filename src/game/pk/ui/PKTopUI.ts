class PKTopUI extends game.BaseContainer {
    private static _instance:PKTopUI
    public static getInstance() {
        return this._instance;
    }

    private hpText1: eui.Label;
    private defGroup1: eui.Group;
    private defText1: eui.Label;
    private defBG1: eui.Rect;
    private defBGMask1: eui.Image;
    private defGroup2: eui.Group;
    private defText2: eui.Label;
    private defBG2: eui.Rect;
    private defBGMask2: eui.Image;
    private hpText2: eui.Label;
    private topUI: TopUI;
    private skillGroup: eui.Group;







    public itemArr = []
    public itempool = []
    public skillItemArr = []
    public skillItemPool = []
    private index = 1;
    public constructor() {
        super();

        this.skinName = "PKTopSkin";
        PKTopUI._instance = this;
    }


    public childrenCreated() {
        super.childrenCreated();
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
        this.defBG1.mask = this.defBGMask1
        this.defBG2.mask = this.defBGMask2
    }

    public onVideoEvent(e){
        //var item:PKMonsterItem;
        var videoData = e.data;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_POS_SHOW:
                var data:PKPosCardData = videoData.user;
                var teamData = data.getOwner().teamData
                if(teamData.id != 'sys' && teamData != PKData.getInstance().myPlayer.teamData)
                    this.addSkillItem(data);
                if(data.mid > 100)
                    this.addSkill(data)
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
    private createSkillItem():PKSkillItem{
        var item:PKSkillItem = this.skillItemPool.pop();
        if(!item)
        {
            item = new PKSkillItem();
            item.y = 66;
        }
        return item;
    }

    public removeSkillItem(item){
        var index = this.skillItemArr.indexOf(item);
        if(index != -1)
        {
            this.skillItemArr.splice(index,1);
            this.freeSkillItem(item);
        }
    }

    public freeSkillItem(item){
        if(!item)
            return;
        item.remove();
        this.skillItemPool.push(item);

    }


    public addSkill(data){
         var item = this.createSkillItem();
        this.skillGroup.addChild(item);
        item.data = data;
        this.skillItemArr.push(item)
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

        this.index = 1;
        this.renewHp()
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }
        while(this.skillItemArr.length)
        {
            this.freeSkillItem(this.skillItemArr.pop())
        }
        for(var i=0;i<7;i++)
        {
            var item = this.createItem();
            this.itemArr.push(item)
            item.x = this.getX(i);
            this.addChild(item);
            item.data = null;
        }

        this.defGroup1.visible = true
        this.defGroup2.visible = true
        this.defBG1.visible = true
        this.defBG2.visible = true
        this.defBG1.height = 0
        this.defBG2.height = 0
        //
        //this.defScoreGroup1.x = 180
        //this.defScoreGroup2.x = 390
        //this.defScoreGroup1.y = 250
        //this.defScoreGroup2.y = 250


        this.defText1.text = '+0%'
        this.defText2.text = '+0%'


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
        //this.defScoreGroup1.visible = true
        //this.defScoreGroup2.visible = true
       if(team.atkRota == PKConfig.ROTA_LEFT)
       {
           var txt = this.defText1
           var bg = this.defBG1
       }
        else
       {
           var txt = this.defText2
           var bg = this.defBG2
       }
        var text =  '+' + team.getTeamDef() + '%';
        if(txt.text != text)
        {
            txt.text = text;
            egret.Tween.removeTweens(txt);
            txt.scaleX = txt.scaleY = 1.3;
            var tw = egret.Tween.get(txt);
            tw.to({scaleX:1,scaleY:1},200);
        }
        if(team.def)
        {
            //bg.visible = true
            egret.Tween.removeTweens(bg);
            var tw = egret.Tween.get(bg)
            var h = 30 * (team.def%5 || 5)/5;

            if(h < bg.height)
            {
                tw.to({height:30},50).to({height:0}).to({height:h},50)
            }
            else
                tw.to({height:h},100)
        }
        else
            bg.visible = false

    }
    public def2(){
        this.defBG1.visible = false
        this.defBG2.visible = false
        //var PD = PKData.getInstance();
        //
        //this.defText1.text = '+' +  PD.getTeamByRota(PKConfig.ROTA_LEFT).getTeamDef() + '%'
        //this.defText2.text = '+' +  PD.getTeamByRota(PKConfig.ROTA_RIGHT).getTeamDef()  + '%'
        //
        //var tw = egret.Tween.get(this.defScoreGroup1)
        //tw.to({x:10,y:230},300)
        //var tw = egret.Tween.get(this.defScoreGroup2)
        //tw.to({x:570,y:230},300).call(function(){
        //    this.defGroup1.visible = true
        //    this.defGroup2.visible = true
        //    this.defScoreGroup1.visible = false
        //    this.defScoreGroup2.visible = false
        //},this)
    }

    public addSkillItem(data){
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item:PKTopItem = this.itemArr[i];
            var targetX = this.getX(i+1);
            egret.Tween.removeTweens(item)
            var tw = egret.Tween.get(item)
            tw.to({x:targetX},Math.abs(item.x - targetX)*2)
            if(targetX >= this.getX(7))
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
        data.topIndex = this.index
        this.index ++;
        item.data = data;
        item.appear()
    }

    private getX(index){
        return 16 + index*88
    }



}