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

    public getHeadList(){
        var arr = [];
        for(var i=1;i<20;i++)
            arr.push(i);
        //var data = MonsterVO.data;
        //for(var s in data)
        //{
        //    var vo =  data[s];
        //    if(vo.level <= UM.level)
        //        arr.push(vo);
        //}
        return arr;
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
            var slave = self.otherSlave[info.gameid] = {
                slave: msg.slave || [],
                self: msg.self,
                master: msg.master
            }
            if(msg.self)
                info.protime = msg.self.protime
            if(msg.master)
                msg.master.isMaster  = true;

            slave.slave.sort(function(a:any,b:any){
                if(a.addtime < b.addtime)
                    return -1
                return 1
            })

            if (fun)
                fun();
        });
    }


    public change_head(headid,fun?) {
        var oo:any = {};
        oo.headid = headid;
        Net.addUser(oo);
        Net.send(GameEvent.user.change_head, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("改名失败，错误码：" + msg.fail);
                return;
            }
            UM.head = headid
            EM.dispatchEventWith(GameEvent.client.head_change)
            if (fun)
                fun();
        });
    }
}