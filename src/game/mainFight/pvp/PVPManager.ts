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

    public lastEnemyList

    public base = {
        1:{score:0,title:'LV1'},
        2:{score:50,title:'LV2'},
        3:{score:120,title:'LV3'},
        4:{score:200,title:'LV4'},
        5:{score:300,title:'LV5'},
        6:{score:500,title:'LV6'},
        7:{score:800,title:'LV7'},
        8:{score:1200,title:'LV8'},
        9:{score:1800,title:'LV9'},
        10:{score:2500,title:'LV10'},
        11:{score:3200,title:'LV11'},
        12:{score:4000,title:'LV12'},
        13:{score:5000,title:'LV13'},
        14:{score:6000,title:'LV14'},
        15:{score:7000,title:'LV15'},
        16:{score:8000,title:'LV16'},
        17:{score:9000,title:'LV17'},
        18:{score:10000,title:'LV18'},
        19:{score:12000,title:'LV19'},
        20:{score:15000,title:'LV20'},
    }

    public getLevel(score){
        for(var i= 20;i>=1;i--)
        {
            if(score >= this.base[i].score)
                return i;
        }
    }

    private renewInfo(info) {

    }

    public getPVP(fun?) {
        if(this.getTime && DateUtil.isSameDay(this.getTime))
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
    public pkOffLineContinue(id,fun?) {
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var self = this;
        var oo:any = {};
        oo.id = id;
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

}