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
    public videoData:any = {};
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
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.hang.pk_hang_result, oo, (data)=> {
            var msg = data.msg;
            //if(msg.fail == 1)
            //{
            //    MyWindow.Alert('找不到对战记录')
            //    PKingUI.getInstance().hide();
            //    return;
            //}
            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
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

    public getVideoList(fun?) {
        var level = this.level + 1;
        if(this.videoData.level == level && TM.now() - this.videoData.time < 60*10)
        {
            if (fun)
                fun();
            return;
        }
        var oo:any = {level:level};
        Net.send(GameEvent.hang.hang_video_list, oo, (data)=> {
            var msg = data.msg;
            this.videoData.level = level;
            this.videoData.time = TM.now();
            this.videoData.list = msg.list;

            for(var i=0;i<msg.list.length;i++)
            {
                var info = JSON.parse(msg.list[i].info);
                if(info.version != Config.pk_version)
                {
                    msg.list.splice(i,1);
                    i--;
                }
            }
            if (fun)
                fun();
        });
    }

    public getVideo(id,time,fun?) {
        if(this.videoData[id+'_'+time])
        {
            this.showHangVideo(this.videoData[id+'_'+time]);
            return;
        }
        var oo:any = {};
        oo.id = id;
        oo.time = time;
        Net.send(GameEvent.hang.hang_video, oo, (data)=> {
            var msg = data.msg;
            if(!msg.data.data)
            {
                MyWindow.ShowTips('该录像已过期！')
                this.videoData.time = 0;
                this.getVideoList(()=>{
                    HangHelpUI.getInstance().renew();
                })
                return;
            }
            this.videoData[id+'_'+time] = JSON.parse(msg.data.data)
            this.showHangVideo(this.videoData[id+'_'+time]);
        });
    }

    private showHangVideo(data){

        var pkData = data.pkdata

        pkData.type = PKManager.TYPE_HANG;
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