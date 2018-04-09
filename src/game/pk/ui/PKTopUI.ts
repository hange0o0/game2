class PKTopUI extends game.BaseContainer {
    private static _instance:PKTopUI
    public static getInstance() {
        return this._instance;
    }
    private hpGroup1: eui.Group;
    public hpGroupIcon: eui.Image;
    private hpText1: eui.Label;
    private defGroup1: eui.Group;
    private defBG1: eui.Rect;
    private defBGMask1: eui.Image;
    private defText1: eui.Label;
    private defGroup2: eui.Group;
    private defBG2: eui.Rect;
    private defBGMask2: eui.Image;
    private defText2: eui.Label;
    private hpGroup2: eui.Group;
    private hpText2: eui.Label;
    private topUI: TopUI;








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

        MyTool.removeMC(this.defGroup1)
        MyTool.removeMC(this.defGroup2)
        this.touchEnabled = false;
    }

    public onVideoEvent(e){
        if(!this.stage)
            return;
        //var item:PKMonsterItem;
        var videoData = e.data;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_POS_SHOW:
                var data:PKPosCardData = videoData.user;
                var teamData = data.getOwner().teamData
                if(teamData.id != 'sys' && teamData != PKData.getInstance().myPlayer.teamData)
                    this.addSkillItem(data);
                if(data.mid > PKConfig.skillBeginID)
                    this.addSkill(data)
                break;
            case PKConfig.VIDEO_MONSTER_WIN:
            case PKConfig.VIDEO_TEAM_HP_CHANGE:
                this.renewHp();
                break;
            case PKConfig.VIDEO_TEAM_DEF:
                this.def1(videoData.user);
                break;
            case PKConfig.VIDEO_TEAM_DEF2:
                this.def2();
                break;
            case PKConfig.VIDEO_MYPLAYER_CHANGE:
                this.onMyPlayerChange();
                break;
        }
    }

    public onMyPlayerChange(){
        var posList = PKData.getInstance().myPlayer.teamData.enemy.posList
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }

        this.index = posList.length + 1;
        for(var i=0;i<7;i++)
        {
            var data = posList[i];
            var item = this.createItem();
            this.itemArr.push(item)
            item.x = this.getX(i);
            this.addChild(item);
            if(data)
                data.topIndex = this.index - 1 - i;
            item.data = data;
        }
    }

    private createSkillItem():PKSkillItem{
        var item:PKSkillItem = this.skillItemPool.pop();
        if(!item)
        {
            item = new PKSkillItem();
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
        if(data.mid > 500)
            return;

        var teamData = data.getOwner().teamData
        var item = this.createSkillItem();
        this.addChild(item)

        if(teamData.atkRota == PKConfig.ROTA_LEFT)
        {
            item.currentState = 'left'
            item.index = this.getIndex('left')
            item.data = data;
        }
        else
        {
            item.currentState = 'right'
            item.index = this.getIndex('right')
            item.data = data;
        }
        this.skillItemArr.push(item)
    }

    private getIndex(type){
        var indexObj = {};
        for(var i=0;i<this.skillItemArr.length;i++)
        {
            var item = this.skillItemArr[i];
            if(item.currentState == type)
            {
                indexObj[item.index] = true;
            }
        }
        var index = 1;
        while(true)
        {
            if(!indexObj[index])
                return index;
            index++;
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

    public remove(){
        while(this.itemArr.length)
        {
            this.freeItem(this.itemArr.pop())
        }
        //while(this.skillItem2Arr.length)
        //{
        //    this.freeSkillItem2(this.skillItem2Arr.pop())
        //}
        while(this.skillItemArr.length)
        {
            this.freeSkillItem(this.skillItemArr.pop())
        }
    }

    public init(title){
        this.topUI.setTitle(title);
        if(GameManager.stage.stageHeight > 1050)
            this.y = 0
        else
            this.y = -55;

        this.index = 1;
        this.renewHp()

        this.remove();
        for(var i=0;i<7;i++)
        {
            var item = this.createItem();
            this.itemArr.push(item)
            item.x = this.getX(i);
            this.addChild(item);
            item.data = null;
        }

        egret.Tween.removeTweens(this.hpGroup1)
        egret.Tween.removeTweens(this.hpGroup2)
        egret.Tween.removeTweens(this.defGroup1)
        egret.Tween.removeTweens(this.defGroup2)
        this.hpGroup1.scaleX = this.hpGroup1.scaleY = 0
        this.hpGroup2.scaleX = this.hpGroup2.scaleY = 0
        //this.defGroup1.scaleX = this.defGroup1.scaleY = 0
        //this.defGroup2.scaleX = this.defGroup2.scaleY = 0


        this.defBG1.visible = true
        this.defBG2.visible = true
        this.defBG1.height = 0
        this.defBG2.height = 0
        //
        //this.defScoreGroup1.x = 180
        //this.defScoreGroup2.x = 390
        //this.defScoreGroup1.y = 250
        //this.defScoreGroup2.y = 250

        var PD = PKData.getInstance();
        this.defText1.text = '+'+PD.getTeamByRota(PKConfig.ROTA_LEFT).getTeamDef()+'%'
        this.defText2.text = '+'+PD.getTeamByRota(PKConfig.ROTA_RIGHT).getTeamDef()+'%'
    }

    public appearMV(){
        egret.Tween.get(this.hpGroup1).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        egret.Tween.get(this.hpGroup2).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        //egret.Tween.get(this.defGroup1).wait(200).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
        //egret.Tween.get(this.defGroup2).wait(200).to({scaleX:1.2,scaleY:1.2},300).to({scaleX:1,scaleY:1},300)
    }

    public renewHp(){
        var PD = PKData.getInstance();
        var team1 = PD.getTeamByRota(PKConfig.ROTA_LEFT);
        var team2 = PD.getTeamByRota(PKConfig.ROTA_RIGHT);
        this.hpText1.text = Math.max(0,team1.hp) + ''// + team1.maxhp + ' 增加防御:' + team1.def
        this.hpText2.text = Math.max(0,team2.hp) + ''// + team2.maxhp   //  ' 增加防御:' + team2.def + ' '+
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