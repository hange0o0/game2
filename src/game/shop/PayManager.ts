class PayManager {
    private static _instance:PayManager;
    public static getInstance():PayManager {
        if (!this._instance)
            this._instance = new PayManager();
        return this._instance;
    }
    public diamondBase = {
        '101':{'cost':6,'diamond':60},
        '102':{'cost':30,'diamond':305},
        '103':{'cost':100,'diamond':1024},
        '104':{'cost':680,'diamond':6980},
        '105':{'cost':1,'diamond':1}
    }

    public shopData
    public shopTime

    public get_shop(fun?){
        if(this.shopTime && DateUtil.isSameDay(this.shopTime))
        {
            if(fun)
                fun()
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.pay.get_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("商店数据异常，错误码：" + msg.fail);
                return;
            }
            this.shopData = msg.shop;
            this.shopTime = TM.now();
            if(fun)
                fun();
        });
    }


    public buy_shop(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pay.buy_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("购买失败，错误码：" + msg.fail);
                return;
            }
            for(var i=0;i<this.shopData.length;i++)
            {
                if(this.shopData[i].id == id)
                {
                    this.shopData[i].num = 0;
                    break;
                }
            }
            if(fun)
                fun();
        });
    }

    public add_diamond(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pay.add_diamond,oo,(data) =>{
            var msg = data.msg;
            if(fun)
                fun();
        });
    }
}

