class SlaveManager {
    private static _instance:SlaveManager;
    public static getInstance():SlaveManager {
        if (!this._instance)
            this._instance = new SlaveManager();
        return this._instance;
    }
    public lastGetSlaveTime = 0
    public slaveList = [];


    public lastMissTime = 0
    public missList = [];

    public maxNum = 6;
    public getCurrentMax(){
        return 3
    }
    public getMySlaveNum(){
        var count = 0;
        for(var i=0;i<this.slaveList.length;i++)
        {
            if(this.slaveList[i].master == UM.gameid)
                count ++;
        }
        return count;
    }

    public slave_award(fun?) {
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_award, oo, function (data) {
            var msg = data.msg;
            if (fun)
                fun();
        });
    }

    public slave_delete(fun?) {
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_delete, oo, function (data) {
            var msg = data.msg;
            if (fun)
                fun();
        });
    }
    public slave_list(fun?) {
        if(TM.now() - this.lastGetSlaveTime < 60)
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
            self.slaveList = msg.list || [];
            for(var i=0;i<self.slaveList.length;i++)
            {
                if(self.slaveList[i].gameid == UM.gameid)
                {
                    if(!self.slaveList[i].master  || self.slaveList[i].master == self.slaveList[i].gameid)
                        self.slaveList.splice(i,1)
                    break;
                }
            }
            self.slaveList.sort(function(a:any,b:any){
                if(a.master == UM.gameid && b.master != UM.gameid)
                    return 1;
                if(a.master != UM.gameid && b.master == UM.gameid)
                    return -1;
                if(a.addtime < b.addtime)
                    return -1
                return 1
            })
            if (fun)
                fun();
        });
    }
    public slave_miss(fun?) {
        if(TM.now() - this.lastMissTime < 60)
        {
            fun && fun();
            return;
        }
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_miss, oo, function (data) {
            self.lastMissTime = TM.now();
            var msg = data.msg;
            self.missList = msg.list || [];
            if (fun)
                fun();
        });
    }
    public slave_pk_begin(otherid,master,id,fun?) {
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
                Alert('体力不足')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('找不到指定阵型')
                return;
            }
            if(msg.fail == 3)
            {
                Alert('没有这个玩家')
                return;
            }
            if(msg.fail == 4)
            {
                Alert('没找到对方防御阵容')
                return;
            }
            if(msg.fail == 5)
            {
                Alert('没有这个玩家')
                return;
            }
            if(msg.fail == 7)
            {
                Alert('奴隶数达上限')
                return;
            }
            if(msg.fail == 6)
            {
                Alert('对方主人已改变')
                delete InfoManager.getInstance().otherInfo[otherid]
                InfoManager.getInstance().getInfo(otherid,()=>{
                    EM.dispatchEventWith(GameEvent.client.info_change)
                })
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
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_pk_result, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到对战记录')
                PKingUI.getInstance().hide();
                return;
            }
            if(msg.fail == 2)
            {
                Alert('对方的主人已改变')
                PKingUI.getInstance().hide();
                delete InfoManager.getInstance().otherInfo[msg.otherid]
                InfoManager.getInstance().getInfo(msg.otherid,()=>{
                    EM.dispatchEventWith(GameEvent.client.info_change)
                })
                return;
            }

            if(msg.fail && PKManager.getInstance().testFail(msg.fail))
            {
                PKingUI.getInstance().hide();
                return;
            }

            if (fun)
                fun();
        });
    }
}