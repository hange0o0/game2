class InfoManager {
    private static _instance:InfoManager;
    public static getInstance():InfoManager {
        if (!this._instance)
            this._instance = new InfoManager();
        return this._instance;
    }
    public otherInfo = {};
    public otherSlave = {};
    public errorOpenID = {};


    public init(data){

    }

    public getInfo(otherid,fun?,stopAlert?) {
        if(this.otherInfo[otherid] && TM.now() - this.otherInfo[otherid].getTime <  60)
        {
            if(fun)
                fun();
            return
        }
        var self = this;
        if(self.errorOpenID[otherid]){
            MyWindow.Alert(stopAlert || '没有找到该用户')
            return;
        }
        var self = this;
        var oo:any = {};
        oo.otherid = otherid;
        Net.addUser(oo);
        Net.send(GameEvent.user.user_info, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                self.errorOpenID[otherid] = true;
                MyWindow.Alert(stopAlert || '没有找到该用户')
                return;
            }

            var info = msg.info;
            info.getTime = TM.now();
            self.otherInfo[info.gameid] = info;
            var slave = self.otherSlave[info.gameid] = msg.slave || [];

            for(var i=0;i<slave.length;i++)
            {
                if(slave[i].gameid == info.gameid)
                {
                    if(!slave[i].master || slave[i].master == slave[i].gameid)
                    {
                        info.protime = slave[i].protime
                        slave.splice(i,1)
                    }
                    break;
                }
            }

            slave.sort(function(a:any,b:any){
                if(a.master == info.gameid && b.master != info.gameid)
                    return 1;
                if(a.master != info.gameid && b.master == info.gameid)
                    return -1;
                if(a.addtime < b.addtime)
                    return -1
                return 1
            })

            if (fun)
                fun();
        });
    }
}