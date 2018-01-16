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
                    if(!self.slaveList[i].master)
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
    public slave_pk_begin(id,fun?) {
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.slave.slave_pk_begin, oo, function (data) {
            var msg = data.msg;
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
            if (fun)
                fun();
        });
    }
}