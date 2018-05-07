class HangManager {
    private static _instance:HangManager;
    public static getInstance():HangManager {
        if (!this._instance)
            this._instance = new HangManager();
        return this._instance;
    }

    public level;
    public awardtime;
    public pktime;
    public lastlist;
    public init(data){
        this.level = data.level
        this.awardtime = data.awardtime
        this.pktime = data.pktime
        this.lastlist = (data.lastlist || '').split(',')
    }

    public getHangBGID(){
        return Math.ceil((this.level+1)/3)%10 || 10
    }

    public getPKCD(){
        return 10 + this.level*3;
    }

    public getPKLeft(){
        return this.pktime + this.getPKCD() - TM.now()
    }

    public getAwardLeft(){
        return this.awardtime + 60 - TM.now()
    }

    public award(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.hang.award_hang, oo, (data)=>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('还没到领取时间')
                return;
            }
            this.awardtime = msg.awardtime;
            AwardUI.getInstance().show(msg.award)
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
                MyWindow.Alert('体力不足')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            PKManager.getInstance().startPK(PKManager.TYPE_HANG,msg.pkdata)
            if (fun)
                fun();
        });
    }

    public pkTest(id,fun?) {
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.debug.pk_test, oo, function (data) {
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
            PKManager.getInstance().startPK(PKManager.TYPE_TEST,msg.pkdata)
            if (fun)
                fun();
        });
    }

    public pkResult(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        Net.addUser(oo);
        Net.send(GameEvent.hang.pk_hang_result, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('找不到对战记录')
                PKingUI.getInstance().hide();
                return;
            }
            if(msg.fail && PKManager.getInstance().testFail(msg.fail))
            {
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;
            this.level = msg.level;
            this.pktime = msg.pktime;
            this.lastlist = (msg.lastlist || '').split(',')
            if(!this.awardtime)
                this.awardtime = this.pktime;
            EM.dispatch(GameEvent.client.hang_change);
            if (fun)
                fun();
        });
    }


}