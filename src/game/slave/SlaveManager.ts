class SlaveManager {
    private static _instance:SlaveManager;
    public static getInstance():SlaveManager {
        if (!this._instance)
            this._instance = new SlaveManager();
        return this._instance;
    }
    public lastGetSlaveTime = 0
    public protime = 0//保护到期时间


    public viewObj;
    public maxViewNum = 30;

    public slaveList = [];
    public master;
    public selfData;


    public lastMissTime = 0
    public missList = [];
    public missNoUse = [];
    public missUse = [];

    public slaveDeleteTime = {};

    public minSlaveAwardTime = 0;
    public loginSlaveNum = 0;
    public maxNum = 2+6;
    public getCurrentMax(){
        return 1 + TecManager.getInstance().getLevel(3)
    }

    public constructor() {
        this.slaveDeleteTime = SharedObjectManager.getInstance().getMyValue('slave_delete_time') || {}
        var t = TM.now();
        for(var s in this.slaveDeleteTime)
        {
            if(t - this.slaveDeleteTime[s] > 3600)
                delete this.slaveDeleteTime[s];
        }
    }

    public initLogin(msg){
        this.minSlaveAwardTime = Math.floor(msg.lastslavetime) || 0
        this.loginSlaveNum = Math.floor(msg.loginslavenum) || 0
    }

    public isRed(){
        return this.minSlaveAwardTime && (TM.now() - this.minSlaveAwardTime)/3600 > 10
    }

    public getSlaveNum(){
        return SlaveManager.getInstance().slaveList.length || this.loginSlaveNum
    }

    public resetMinSlaveTime(){
        var lastRed = this.isRed();
        this.minSlaveAwardTime = Number.MAX_VALUE;
        for(var i=0;i<this.slaveList.length;i++)
        {
            var oo = this.slaveList[i];
            if(Math.floor(oo.awardtime) < this.minSlaveAwardTime)
            {
                this.minSlaveAwardTime = Math.floor(oo.awardtime)
            }
        }
        this.loginSlaveNum = this.slaveList.length;
        if(lastRed != this.isRed())
            EM.dispatch(GameEvent.client.red_change)
    }


    public isSlaveOpen(){
        return HangManager.getInstance().level >= Config.slaveLevel;
    }

    public getProtectedWord(id,masterID){
        if(id == masterID)
            return '保护'
        return '镇压'
    }

    public getDeleteCD(id){
        var t = this.slaveDeleteTime[id] || 0
        if(TM.now() - t < 3600)
            return t + 3600 - TM.now();
        return 0;
    }

    //取最近一个主人的有效开始时间
    public getMasterTime(test?){
        var mtime = 0;
        if(this.lastGetSlaveTime)//有取过奴隶数据
        {
             if(this.master && this.selfData)
                 mtime = this.selfData.addtime;
        }
        var master = UM.openData.masterstep.split(',').pop().split('|');
        if(master.length == 2 && master[0] == 1)
        {
            var mtime2 = parseInt(master[1]);
            if(mtime2 != mtime)//奴隶数据库与玩家的open数据不一致
            {
                if(mtime > mtime2 || test)//openData数据太旧
                {
                    this.slave_reset_open();
                }
                else if(this.lastGetSlaveTime)//玩家列表数据太旧
                {
                    this.lastGetSlaveTime = 0;
                    if(SlaveUI.getInstance().stage)
                    {
                         this.slave_list(()=>{
                             this.getMasterTime(true);
                             EM.dispatchEventWith(GameEvent.client.slave_change)
                         })
                    }
                }
            }
            if(!this.lastGetSlaveTime)
                mtime = mtime2
        }
        return mtime
    }

    //可领奖的奴隶
    public getAwardList(){
        var arr = []
        var t = TM.now();
        for(var i=0;i<this.slaveList.length;i++)
        {
            var oo = this.slaveList[i];
            if(t - oo.awardtime >= 3600)
            {
                arr.push(oo.gameid)
            }
        }
        return arr;
    }

    //取奴隶数据
    public getSlave(gameid){
        if(!this.slaveList)
            return null;
        for(var i=0;i<this.slaveList.length;i++)
        {
            var oo = this.slaveList[i];
            if(oo.gameid == gameid)
            {
                return oo;
            }
        }
        return null;
    }

    public slave_reset_open(fun?) {
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_reset_open, oo, function (data) {
            var msg = data.msg;
            if (fun)
                fun();
        });
    }

    public slave_award(ids,fun?) {
        var self = this;
        var oo:any = {};
        oo.ids = ids;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_award, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                this.slave_list(()=>{
                    EM.dispatchEventWith(GameEvent.client.slave_change)
                })
            }
            if(msg.fail == 1)
            {
                MyWindow.Alert('找到不奴隶数据');
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('还没到领取时间');
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('奴隶数据已改变');
                return;
            }
            for(var i=0;i<this.slaveList.length;i++)
            {
                var oo = this.slaveList[i];
                if(msg.changetime[oo.gameid])
                    oo.awardtime = parseInt(oo.awardtime) + msg.changetime[oo.gameid]*3600
            }
            this.resetMinSlaveTime();
            AwardUI.getInstance().show(msg)
            if (fun)
                fun();
        });
    }

    public slave_delete(otherid,fun?) {
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_delete, oo, (data) => {
            var msg = data.msg;
            for(var i=0;i<this.slaveList.length;i++)
            {
                var oo = this.slaveList[i];
                if(oo.gameid == otherid)
                {
                    this.slaveList.splice(i,1);
                    break;
                }
            }
            this.resetMinSlaveTime();
            this.slaveDeleteTime[otherid] = TM.now();
            SharedObjectManager.getInstance().setMyValue('slave_delete_time',this.slaveDeleteTime)

            EM.dispatchEventWith(GameEvent.client.slave_change)
            EM.dispatchEventWith(GameEvent.client.info_change)
            if (fun)
                fun();
        });
    }

    public slave_addprotect(otherid,hour,fun?) {
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        oo.hour = hour;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_addprotect, oo, (data) => {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('钻石不足')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('增加保护时间')
                self.lastGetSlaveTime = 0;
                self.slave_list(()=>{
                    EM.dispatchEventWith(GameEvent.client.slave_change)
                    EM.dispatchEventWith(GameEvent.client.info_change)
                });
                return;
            }

            if(otherid == UM.gameid)
            {
                this.protime = msg.protime;
            }
            else
            {
                for(var i=0;i<this.slaveList.length;i++)
                {
                    var oo = this.slaveList[i];
                    if(oo.gameid == otherid)
                    {
                        oo.protime = msg.protime
                        break;
                    }
                }
            }

            EM.dispatchEventWith(GameEvent.client.slave_change)
            EM.dispatchEventWith(GameEvent.client.info_change)
            if (fun)
                fun();
        });
    }

    public slave_list(fun?) {
        if(TM.now() - this.lastGetSlaveTime < 3600)
        {
            fun && fun();
            return;
        }

        if(ObjectUtil.objLength(PosManager.getInstance().defList) == 0)
        {
            fun && fun();
            return;
        }

        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_list, oo, function (data) {
            var msg = data.msg;
            self.lastGetSlaveTime = TM.now();
            self.slaveList = msg.slave || [];
            self.master = msg.master;
            self.selfData = msg.self;
            if(msg.self)
                self.protime = msg.self.protime
            if(msg.master)
                self.master.isMaster = true

            self.slaveList.sort(function(a:any,b:any){
                if(a.addtime < b.addtime)
                    return -1
                return 1
            })
            self.resetMinSlaveTime();

            if (fun)
                fun();
        });
    }
    public slave_miss(fun?) {
        if(TM.now() - this.lastMissTime < 60 || this.resetMissList())
        {
            fun && fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_miss, oo, (data)=> {
            self.lastMissTime = TM.now();
            var msg = data.msg;
            this.missList = [];
            this.missUse = [];
            this.missNoUse = msg.list || [];
            ArrayUtil.random(this.missNoUse);
            this.resetMissList()
            if (fun)
                fun();
        });
    }

    //重置Miss数据,因为服务器会返回最多30条数据
    private resetMissList(){
        if(this.missNoUse.length == 0)
            return false;
        var myMaster = this.master

        this.missUse = this.missUse.concat(this.missList)
        for(var i=0;i<this.missNoUse.length;i++)//去除主人和奴隶
        {
            if(myMaster == this.missNoUse[i].gameid || this.getSlave(this.missNoUse[i].gameid))
            {
                this.missNoUse.splice(i,1);
                i--;
            }
        }
        var needNum = 4
        this.missList = this.missNoUse.splice(0,needNum);
        if(this.missList.length < needNum && this.missUse.length > 0)//去除主人和奴隶
        {
            for(var i=0;i<this.missUse.length;i++)
            {
                if(myMaster == this.missUse[i].gameid || this.getSlave(this.missUse[i].gameid))
                {
                    this.missUse.splice(i,1);
                    i--;
                }
            }

            ArrayUtil.random(this.missUse);
            this.missList = this.missList.concat(this.missUse.splice(0,needNum - this.missList.length));
        }
        return true;
    }

    public slave_pk_begin(otherid,master,id,fun?) {
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        oo.master = master;
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_pk_begin, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('体力不足')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('找不到指定阵型')
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('没有这个玩家')
                return;
            }
            if(msg.fail == 4)
            {
                MyWindow.Alert('没找到对方防御阵容')
                return;
            }
            if(msg.fail == 5)
            {
                MyWindow.Alert('没有这个玩家')
                return;
            }
            if(msg.fail == 7)
            {
                MyWindow.Alert('对方保护CD中')
                return;
            }
            if(msg.fail == 8)
            {
                MyWindow.Alert('奴隶数达上限')
                return;
            }
            if(msg.fail == 6)
            {
                MyWindow.Alert('对方主人已改变')
                EM.dispatchEventWith(GameEvent.client.info_change)
                return;
            }
            if(msg.fail == 9)
            {
                MyWindow.Alert('技能卡数量不足')
                return;
            }
            if(msg.fail)
            {
                MyWindow.Alert('PK初始异常，错误码：' + msg.fail)
                return;
            }
            PKManager.getInstance().startPK(PKManager.TYPE_SLAVE,msg.pkdata)
            if (fun)
                fun();
        });
    }

    public slave_pk_result(fun?) {
        var self = this;
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.slave.slave_pk_result, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 2)
            {
                MyWindow.Alert('对方的主人已改变')
                PKingUI.getInstance().hide();
                EM.dispatchEventWith(GameEvent.client.info_change)
                return;
            }

            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;
            self.lastGetSlaveTime = 0;
            self.slave_list(()=>{
                EM.dispatchEventWith(GameEvent.client.slave_change)
                EM.dispatchEventWith(GameEvent.client.info_change)
            });

            if (fun)
                fun();
        },true,1,true);
    }

    //**************************************************************   view   ********************
    public getViewList(){
        var arr = ObjectUtil.objToArray(this.viewObj)
        ArrayUtil.sortByField(arr,['time'],[1])
        return arr;
    }

    public viewList(fun?) {
        if(this.viewObj)
        {
            fun && fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_view_list, oo, (data)=> {
            var msg = data.msg;
            this.viewObj = msg.list
            for(var s in this.viewObj)
            {
                this.viewObj[s].gameid = s;
            }
            if (fun)
                fun();
        });
    }
    public addView(otherid,fun?) {
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_add_view, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('添加关注失败')
                return;
            }
            this.viewObj[otherid] = msg.info;
            this.viewObj[otherid].gameid = otherid;
            EM.dispatchEventWith(GameEvent.client.view_change)
            if (fun)
                fun();
        });
    }
    public deleteView(otherid,fun?) {
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_delete_view, oo, (data)=> {
            var msg = data.msg;
            delete this.viewObj[otherid];
            EM.dispatchEventWith(GameEvent.client.view_change)
            if (fun)
                fun();
        });
    }

    public showSlaveVideo(data){
        if(data.version != Config.pk_version)
        {
            MyWindow.ShowTips('对战记录已过期')
            return;
        }

        var pkData = data.pkdata

        pkData.type = PKManager.TYPE_SLAVE;
        pkData.result = 1;
        for(var i=0;i<pkData.players.length;i++)
        {
            var players = pkData.players[i];
            if(players.autolist && !players.card)
                players.card = players.autolist
            if(players.team == 1)
                players.actionlist = data.pklist;
        }

        PKManager.getInstance().playReplay(pkData);
    }
}