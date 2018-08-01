class PropManager {
    private static _instance:PropManager;
    public static getInstance():PropManager {
        if (!this._instance)
            this._instance = new PropManager();
        return this._instance;
    }

    public props
    public shopTime = 0
    public shopData

    public init(data){
       this.props = data || {};
    }

    public getNum(id){
       return this.props[id] || 0
    }

    public getListByType(){
        var arr = [];
        for(var s in this.props)
        {
            var vo = PropVO.getObject(s);
            if(this.props[s])
            {
                arr.push(vo);
            }
        }
        ArrayUtil.sortByField(arr,['type','id'],[0,0])
        return arr;
    }

    public getSellList(fun?){
        if(this.shopTime && DateUtil.isSameDay(this.shopTime))
        {
            if(fun)
                fun()
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.prop.get_prop_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("市场数据异常，错误码：" + msg.fail);
                return;
            }
            this.shopData = msg.shop;
            this.shopTime = TM.now();
            if(fun)
                fun();
        });
    }

    public buySell(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.prop.buy_prop_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("交易失败，错误码：" + msg.fail);
                return;
            }
            for(var i=0;i<this.shopData.length;i++)
            {
                if(this.shopData[i].id == id)
                {
                    this.shopData[i].isbuy  = true;
                    break;
                }
            }
            MyWindow.ShowTips('交易成功！')
            SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
            if(fun)
                fun();
        });
    }
}