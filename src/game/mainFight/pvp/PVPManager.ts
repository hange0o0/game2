class PVPManager {
    private static instance:PVPManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PVPManager();
        return this.instance;
    }

    public getTime
    public task
    public online
    public offline
    public serverRound//服务器的论次

    public lastEnemyList
    public history
    public pvpEndTime = 1535904000;
    public pvpCD = 24*3600*28;


    public base = {
        1:{score:0,title:'新兵'},
        2:{score:100,title:'进阶'},
        3:{score:250,title:'法师'},
        4:{score:500,title:'狙击'},
        5:{score:800,title:'神射'},
        6:{score:1100,title:'龙卫'},
        7:{score:1500,title:'星空'},
        8:{score:2000,title:'剑盾'},
        9:{score:2500,title:'冰雪'},
        10:{score:3000,title:'海洋'},
        11:{score:3300,title:'烈焰'},
        12:{score:3600,title:'幽月'},
        13:{score:3900,title:'火阳'},
        14:{score:4300,title:'自然'},
        15:{score:4700,title:'森林'},
        16:{score:5100,title:'生命'},
        17:{score:5500,title:'阴影'},
        18:{score:5900,title:'圣光'},
        19:{score:6300,title:'神皇'},
        20:{score:6800,title:'究极'},
    }

    public getCurrentScore(){
         if(!this.offline)
            return 0;
        return this.getLevel(this.offline.score);
    }

    public getLevel(score){
        for(var i= 20;i>=1;i--)
        {
            if(score >= this.base[i].score)
                return i;
        }
    }

    public getCurrentRound(){
        return Math.ceil(Math.max(0,TM.now() - this.pvpEndTime) /this.pvpCD)  + 1
    }

    public getCurrentEnd(){
        return this.pvpEndTime + (this.getCurrentRound()-1)*this.pvpCD
    }
    //将要结臬
    public nearEnd(){
        if(this.getCurrentEnd() - TM.now() < 10*60)
        {
            if(!PKingUI.getInstance().stage)
                MyWindow.Alert("竞技场即将结算，请稍后")
            EM.dispatchEventWith(GameEvent.client.PVP_END)
            return true;
        }
        return false
    }

    private renewInfo(info) {

    }

    public getPVP(fun?) {
        if(this.getTime && DateUtil.isSameDay(this.getTime) && this.serverRound == this.getCurrentRound())
        {
            if(fun)
                fun()
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.pvp.get_pvp, oo, (data)=> {
            var msg = data.msg;
            if (msg.fail) {
                MyWindow.Alert('进入竞技场失败，错误码：' + msg.fail)
                return;
            }

            this.offline = msg.offline || {};
            this.online = msg.online || {};
            this.task = msg.task;
            this.serverRound = msg.round;
            this.getTime = TM.now();
            fun && fun();
        });
    }

    public pkOffLine(id,fun?) {
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pvp.pk_pvp_offline, oo, (data)=>{
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('体力不足')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('技能卡数量不足')
                return;
            }
            if(msg.fail)
            {
                MyWindow.Alert('PK初始异常，错误码：' + msg.fail)
                return;
            }
            this.offline['pknum'] =  (this.offline['pknum'] || 0) + 1
            PKManager.getInstance().startPK(PKManager.TYPE_PVP_OFFLINE,msg.pkdata)
            EM.dispatchEventWith(GameEvent.client.pvp_change)
            if (fun)
                fun();
        });
    }
    public pkOffLineContinue(id,seed,fun?) {
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var self = this;
        var oo:any = {};
        oo.id = id;
        oo.seed = seed;
        Net.addUser(oo);
        Net.send(GameEvent.pvp.pk_pvp_offline_continue, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('体力不足')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('技能卡数量不足')
                return;
            }
            if(msg.fail)
            {
                MyWindow.Alert('PK初始异常，错误码：' + msg.fail)
                return;
            }
            PKManager.getInstance().startPK(PKManager.TYPE_PVP_OFFLINE,msg.pkdata)
            EM.dispatchEventWith(GameEvent.client.pvp_change)
            if (fun)
                fun();
        });
    }

    public pkOfflineFail(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo);
        Net.send(GameEvent.pvp.pk_pvp_offline_fail, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;
            this.offline['score'] = msg.score
            this.task = msg.task;
            EM.dispatchEventWith(GameEvent.client.pvp_change)
            if (fun)
                fun();
        },true,1,true);
    }

    public pkOfflineWin(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.pvp.pk_pvp_offline_win, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;
            this.offline['winnum'] =  (this.offline['winnum'] || 0) + 1
            this.offline['score'] = msg.score
            this.offline['maxscore'] = Math.max(this.offline['maxscore']||0,msg.score)
            this.task = msg.task;
            this.lastEnemyList = null;
            this.history = null;
            EM.dispatchEventWith(GameEvent.client.pvp_change)
            if (fun)
                fun();
        },true,1,true);
    }

    public getAward(index,fun?) {
        var oo:any = {};
        oo.index = index
        Net.addUser(oo)
        Net.send(GameEvent.pvp.pvp_award, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("领奖错误，错误码：" + msg.fail);
                return;
            }
            this.task = msg.task;
            EM.dispatchEventWith(GameEvent.client.pvp_change)
            AwardUI.getInstance().show(msg.award)
            if (fun)
                fun();
        });
    }

    public getRoundAward(type,fun?) {
        var oo:any = {};
        oo.type = type
        Net.addUser(oo)
        Net.send(GameEvent.pvp.pvp_round_award, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("领奖错误，错误码：" + msg.fail);
                return;
            }
            if(type == 'offline')
            {
                var lv = this.getLevel(this.offline.award);
                var str = '自动场最终段位为：' + this.base[lv].title+'竞技场\n你获得了以下的奖励：'
                this.offline.award=0
            }
            else if(type == 'online')
            {
                var lv = this.getLevel(this.online.award);
                var str = '手动场最终段位为：' + this.base[lv].title+'竞技场\n你获得了以下的奖励：'
                this.online.award=0
            }

            AwardUI.getInstance().show(msg.award,'赛季结束',str,fun)
            SoundManager.getInstance().playEffect(SoundConfig.pk_win);
            EM.dispatchEventWith(GameEvent.client.pvp_change)
        });
    }

}