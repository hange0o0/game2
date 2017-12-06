class HangManager {
    private static _instance:HangManager;
    public static getInstance():HangManager {
        if (!this._instance)
            this._instance = new HangManager();
        return this._instance;
    }

    public level;
    public time;
    public init(data){
        this.level = data.level
        this.time = data.time
    }

    public award(fun?) {
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.hang.award_hang, oo, function (data) {
            var msg = data.msg;
            if (fun)
                fun();
        });
    }

    public pk(id,fun?) {
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.hang.pk_hang, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('体力不足')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('找不到指定阵法')
                return;
            }
            PKManager.getInstance().startPK(PKManager.TYPE_HANG,msg.pkdata)
            if (fun)
                fun();
        });
    }

    public pkResult(fun?) {
        var self = this;
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        Net.addUser(oo);
        Net.send(GameEvent.hang.pk_hang_result, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到对战记录')
                return;
            }
            if(msg.fail && PKManager.getInstance().testFail(msg.fail))
            {
                return;
            }
            if (fun)
                fun();
        });
    }


}