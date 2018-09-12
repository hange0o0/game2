class PKActiveManager {
    public static TYPE_FIGHT = 1
    public static TYPE_ANSWER = 2
    public static TYPE_RANDOM = 3
    public static TYPE_CHOOSE = 4
    public static TYPE_ENDLESS = 5
    private static _instance:PKActiveManager;

    public static getInstance():PKActiveManager {
        if (!this._instance)
            this._instance = new PKActiveManager();
        return this._instance;
    }

    public activeList;
    private pvpScore = 0;

    public base = {
        1:{diamond:10,label:'增加卡牌',title:'远征模式',helpKey:'fight'},
        2:{diamond:15,label:'+5次机会',title:'解迷模式',helpKey:'answer'},
        3:{diamond:30,label:'+5次机会',title:'随机模式',helpKey:'random'},
        4:{diamond:30,label:'续  命',title:'选牌模式',helpKey:'choosecard'},
        5:{diamond:30,label:'+5次机会',title:'无尽模式',helpKey:'endless'},
    }



    //type
    // 1：远程   10钻一次选卡
    // 2：解迷   10钻+3次机会
    // 3：随机   30钻+3次机会
    // 4：选卡   50钻复活并有3条命
    // 5：无尽   30钻+3次机会
    //取当前进行中的活动     {start,end,type,data}
    public getCurrentActive(){
        var t = TM.now();
        for(var s in this.activeList)
        {
            var oo = this.activeList[s];
            if(oo.start<= t && oo.end>= t)
                return oo;
        }
        return null;
    }
    public getNextActive(){
        var t = TM.now();
        var nextActive
        for(var s in this.activeList)
        {
            var oo = this.activeList[s];
            if(oo.start > t)
            {
                if(!nextActive)
                    nextActive = oo;
                else if(nextActive.start > oo.start)
                    nextActive = oo;
            }
        }
        return nextActive;
    }

    //取当前的PVP分数
    public getPvpScore(){
        return PVPManager.getInstance().getCurrentScore() || (this.pvpScore)
    }

    public getActiveIcon(id){
        if(!id)
            return 'active_0_png'
        return 'active_'+id+'_png'
    }

    public getActive(fun?){
        if(LoginManager.getInstance().isOtherLogin)
            return;
        if(this.activeList)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.active.get_active,oo,(data) =>{
            var msg = data.msg;
            this.pvpScore = msg.pvp;
            this.activeList = msg.active;
            for(var s in this.activeList)
            {
                var oo = this.activeList[s]
                oo.start = DateUtil.getTimestampByChineseDate(oo.start)
                oo.end = DateUtil.getTimestampByChineseDate(oo.end)
                if(DEBUG && oo.start > oo.end)
                    throw new Error('1111')
            }
            if(fun)
                fun();
        });
    }

    //取当前活动的数据
    public getActiveInfo(type,fun?){
        switch(type)
        {
            case PKActiveManager.TYPE_FIGHT:
                FightManager.getInstance().getInfo(fun);
                return
            case PKActiveManager.TYPE_ANSWER:
                PKAnswerManager.getInstance().getInfo(fun);
                return
            case PKActiveManager.TYPE_RANDOM:
                PKRandomManager.getInstance().getInfo(fun);
                return
            case PKActiveManager.TYPE_CHOOSE:
                PKChooseCardManager.getInstance().getInfo(fun);
                return
            case PKActiveManager.TYPE_ENDLESS:
                PKEndLessManager.getInstance().getInfo(fun);
                return

        }
    }
    //点击了PK
    public onPK(type,fun?){
        switch(type)
        {
            case PKActiveManager.TYPE_FIGHT:
                FightManager.getInstance().onPKBtn();
                return
            case PKActiveManager.TYPE_ANSWER:
                PKAnswerUI.getInstance().show()
                return
            case PKActiveManager.TYPE_RANDOM:
                PKRandomManager.getInstance().pk(fun)
                return
            case PKActiveManager.TYPE_CHOOSE:
                if(PKChooseCardManager.getInstance().info.choose)
                    PKChooseCardManager.getInstance().onChooseBtn();
                else
                    PKChooseCardManager.getInstance().onPKBtn();
                return
            case PKActiveManager.TYPE_ENDLESS:
                PKEndLessManager.getInstance().onPKBtn();
                return

        }
    }

    //点击了大奖
    public onAward(type,fun?){
        switch(type)
        {
            case PKActiveManager.TYPE_FIGHT:
                FightManager.getInstance().finalAward(fun);
                return
            case PKActiveManager.TYPE_ANSWER:
                PKAnswerManager.getInstance().award(fun);
                return
            case PKActiveManager.TYPE_RANDOM:
                PKRandomManager.getInstance().award(fun);
                return
            case PKActiveManager.TYPE_CHOOSE:
                PKChooseCardManager.getInstance().award(fun);
                return
            case PKActiveManager.TYPE_ENDLESS:
                PKEndLessManager.getInstance().award(fun);
                return

        }
    }

    //点击了重置
    public onReset(type,fun?){
        if(!UM.testDiamond(this.base[type].diamond))
        {
            return;
        }
        switch(type)
        {
            case PKActiveManager.TYPE_FIGHT:
                FightManager.getInstance().addChance(()=>{
                    FightManager.getInstance().continuePK();
                    fun && fun();
                });
                return
            case PKActiveManager.TYPE_ANSWER:
                PKAnswerManager.getInstance().addChance(fun);
                return
            case PKActiveManager.TYPE_RANDOM:
                PKRandomManager.getInstance().addChance(fun);
                return
            case PKActiveManager.TYPE_CHOOSE:
                PKChooseCardManager.getInstance().addChance(fun);
                return
            case PKActiveManager.TYPE_ENDLESS:
                PKEndLessManager.getInstance().addChance(fun);
                return
        }
    }




}