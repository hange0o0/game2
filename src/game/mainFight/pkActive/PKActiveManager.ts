class PKActiveManager {
    private static _instance:PKActiveManager;

    public static getInstance():PKActiveManager {
        if (!this._instance)
            this._instance = new PKActiveManager();
        return this._instance;
    }

    public activeList;
    private pvpScore = 0;

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

    public getList(fun?){
        if(this.activeList)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.mail.get_mail,oo,(data) =>{
            if(fun)
                fun();
        });
    }




}