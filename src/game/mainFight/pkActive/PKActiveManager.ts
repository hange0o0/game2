class PKActiveManager {
    private static _instance:PKActiveManager;

    public static getInstance():PKActiveManager {
        if (!this._instance)
            this._instance = new PKActiveManager();
        return this._instance;
    }

    public activeList;
    private pvpScore = 0;



    //type
    // 1：远程   10钻一次选卡
    // 2：解迷   10钻+3次机会
    // 3：随机   30钻+3次机会
    // 4：选卡   50钻复活并有3条命
    // 5：无尽   30钻+3次机会
    //取当前进行中的活动     {start,end,type,data}
    public getCurrentActive(){
        var t = TM.now();
        for(var i=0;i<this.activeList.length;i++)
        {
            var oo = this.activeList[i];
            if(oo.start<= t && oo.end>= t)
                return oo;
        }
        return null;
    }

    //取当前的PVP分数
    public getPvpScore(){
        return PVPManager.getInstance().getCurrentScore() || (this.pvpScore)
    }

    public getActiveIcon(id){
        if(!id)
            return 'active_0_png'
        return 'active_'+id+'_png'
    }

    public getActive(fun?){
        if(this.activeList)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.active.get_active,oo,(data) =>{
            var msg = data.msg;
            this.pvpScore = msg.pvp;
            this.activeList = msg.active;
            for(var i=0;i<this.activeList.length;i++)
            {
                var oo = this.activeList[i]
                oo.start = DateUtil.getTimestampByChineseDate(oo.start)
                oo.end = DateUtil.getTimestampByChineseDate(oo.end)
                if(DEBUG && oo.start > oo.end)
                    throw new Error('1111')
            }
            if(fun)
                fun();
        });
    }




}