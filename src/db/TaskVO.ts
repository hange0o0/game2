class TaskVO {
    public static dataKey = 'task_base';
    public static key = 'id';
    public static getObject(id: number): TaskVO{
        return CM.table[this.dataKey][id];
    }
    public static lineData = [];
    public static initFinish(){
        var data = CM.table[this.dataKey];
        for(var s in data)
        {
            var vo = data[s];
            this.lineData.push(vo);
        }
        ArrayUtil.sortByField(this.lineData,['index'],[0])
    }



    public id
    public type
    public value1
    public value2
    public diamond
    public coin
    public prop
    public hero
    public skill
    public energy
    public index;


    private currentValue;
    public constructor(data?: any) {
        if(data)
            this.fill(data);

    }

    public fill(data){
        this.id = data.id;
        this.type = data.type;

        this.index = Math.floor(data.index);
        this.value1 = Math.floor(data.value1);
        this.value2 = Math.floor(data.value2);
        this.diamond = Math.floor(data.diamond || 0);
        this.coin = Math.floor(data.coin || 0);
        this.prop = data.prop;
        this.hero = data.hero;
        this.skill = data.skill;
        this.energy = Math.floor(data.energy || 0);

    }

    public getNextTaskVO(){
        var index = TaskVO.lineData.indexOf(this);
        return TaskVO.lineData[index + 1];
    }

    public isEnable(){
        return true;
    }

    public isFinish(){
        var stat = ActiveManager.getInstance().task.stat || {};
        this.currentValue = 0;
        switch(this.type)
        {
            case 'hang':
                this.currentValue = HangManager.getInstance().level;
                return this.currentValue >= this.value1
                break;
            case 'force':
                this.currentValue = UM.tec_force;
                return this.currentValue >= this.value1
                break;
            case 'coin':
                this.currentValue = UM.hourcoin;
                return this.currentValue >= this.value1
                break;
            case 'slave':
                this.currentValue = SlaveManager.getInstance().getSlaveNum();
                return this.currentValue >= this.value1
                break;
            case 'pvp':
                this.currentValue = PKActiveManager.getInstance().getPvpScore();
                return this.currentValue >= this.value1
                break;
            case 'pkactive':
                if(stat['pkactive_t'])
                {
                    this.currentValue = 1;
                    return true;
                }
                return false;
                break;
            case 'resource':
                this.currentValue = TecManager.getInstance().getTotalLevel(4)
                return this.currentValue >= this.value1
                break;
            case 'tec':
                this.currentValue = TecManager.getInstance().getLevel(1);
                return this.currentValue >= this.value1
                break;
            case 'cardnum':
                this.currentValue = CardManager.getInstance().getMyMonsterList(0).length;
                return this.currentValue >= this.value1
                break;
        }
    }
    //点击后的动作
    public onClick(){
        var TM = TaskManager.getInstance();
        TM.nowAction = null
        TM.actionStep = 0
        switch(this.type)
        {
            case 'hang':
                TM.showGuideMC(MainFightUI.getInstance().mapBtn.openBtn)
                break;
            case 'force':
                TM.showGuideMC(MainFightUI.getInstance().forceGroup)
                break;
            case 'coin':
                TM.showGuideMC(MainUI.getInstance().coinGroup);
                break;
            case 'slave':
                TM.showGuideMC(MainUI.getInstance().bottomItems[1]);
                break;
            case 'pvp':
                TM.showGuideMC(PKActiveMainPageUI.getInstance().pvpBtn);
                break;
            case 'pkactive':
                TM.showGuideMC(PKActiveMainPageUI.getInstance().activeBtn);
                break;
            case 'resource':
                TM.nowAction = this.type;
                TM.showGuideMC(MainUI.getInstance().bottomItems[4]);
                break;
            case 'tec':
                TM.nowAction = this.type;
                TM.showGuideMC(MainUI.getInstance().bottomItems[4]);
                break;
            case 'cardnum':
                TM.showGuideMC(MainUI.getInstance().bottomItems[3]);
                break;
            //case 'draw':
            //    TM.showGuideMC(MainPageUI.getInstance()['diamonDrawBtn'])
            //    break;
            //case 'guess':
            //    TM.showGuideMC(MainPageUI.getInstance()['guessBtn'])
            //    break;
            //case 'main_game':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 0)
            //        MainPageUI.getInstance()['mainGame'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page0'])
            //    break;
            //case 'force':
            //    TM.showGuideMC(MainPageUI.getInstance()['collectBtn'])
            //    //CollectUI.getInstance().show()
            //    break;
            //case 'map_game':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 2)
            //        MainPageUI.getInstance()['mapGame'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page2'])
            //    break;
            //case 'main_award':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 0)
            //        MainPageUI.getInstance()['mainGame'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page0'])
            //    break;
            //case 'server_game':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 3)
            //        MainPageUI.getInstance()['serverGame'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page3'])
            //    break;
            //case 'map_game_pk':
            //    TM.nowAction = this.type;
            //    MapMainUI.getInstance().show();
            //    break;
            //case 'map_game_buy':
            //    TM.nowAction = this.type;
            //    MapMainUI.getInstance().show();
            //    break;
            //case 'map_game_next':
            //    TM.nowAction = this.type;
            //    MapMainUI.getInstance().show();
            //    break;
            //case 'honor':
            //    TM.nowAction = this.type;
            //    TM.showGuideMC(MainPageUI.getInstance()['headMC'])
            //    break;
            //case 'comment':
            //    TM.nowAction = this.type;
            //    CollectUI.getInstance().show(HonorManager.getInstance().isHonor())
            //    //MonsterList.getInstance().showID(HonorManager.getInstance().isHonor())
            //    break;
            //case 'buy_ticket':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 4)
            //        MainPageUI.getInstance()['serverGameEqual'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page4'])
            //    break;
            //case 'server_equal_game':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 4)
            //        MainPageUI.getInstance()['serverGameEqual'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page4'])
            //    break;
            //case 'card':
            //    CollectUI.getInstance().show(this.value1)
            //    // MonsterList.getInstance().showID(this.value1)
            //    break;
            //case 'day_game':
            //    TM.nowAction = this.type;
            //    if(MainPageUI.getInstance().currentPage == 1)
            //        MainPageUI.getInstance()['dayGame'].onShow();
            //    else
            //        TM.showGuideMC(MainPageUI.getInstance()['page1'])
            //    break;
            //case 'friend':
            //    TM.nowAction = this.type;
            //    TM.showGuideMC(MainPageUI.getInstance()['friendBtn'])
            //    break;
            //case 'leader':
            //    TM.nowAction = this.type;
            //    TM.showGuideMC(MainPageUI.getInstance()['leaderBtn'])
            //    break;
            //case 'friend_dungeon':
            //    TM.nowAction = this.type;
            //    TM.showGuideMC(MainPageUI.getInstance()['team'])
            //    break;
        }
    }

    //取描述
    public getDes(){
        switch(this.type)
        {

            case 'hang':
                return '通关战役 [' +this.value1 + ']'
                break;
            case 'force':
                return '战力达到 [' +this.value1 + ']'
                break;
            case 'coin':
                return '时产达到 [' +this.value1 + ']'
                break;
            case 'slave':
                return '拥有 [' +this.value1 + ']个奴隶'
                break;
            case 'pvp':
                return '竞技场 [' +this.value1 + ']分'
                break;
            case 'pkactive':
                return '参加 [1]次活动'
                break;
            case 'resource':
                return '资源总等级 [' +this.value1 + ']级'
                break;
            case 'tec':
                return '科技革命 [' +this.value1 + ']级'
            case 'cardnum':
                return '拥有随从卡牌 [' +this.value1 + ']个'
                break;
        }
        return '??'
    }

    //取进度，前提是调用过 isFinish();
    public getRate(){
        switch(this.type)
        {
            case 'hang':
            case 'force':
            case 'coin':
            case 'slave':
            case 'pkactive':
            case 'resource':
            case 'cardnum':
            case 'pvp':
            case 'tec':
                if(this.value1 >= 1000)
                    return '差'+  (this.value1 - this.currentValue)
                return this.currentValue +  ' /' + this.value1;
                break;

            //case 'pvp':
            //    var needValue = PVPManager.getInstance().base[this.value1].score;
            //    var currentVaule = PKActiveManager.getInstance().getPvpScore()
            //    if(needValue >= 1000)
            //        return '差'+  (needValue - currentVaule) + '分'
            //    return currentVaule + '/' + needValue
            //    break;
        }
        return '??'
    }


}