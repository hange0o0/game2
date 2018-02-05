class TecManager {
    private static _instance:TecManager;
    public static getInstance():TecManager {
        if (!this._instance)
            this._instance = new TecManager();
        return this._instance;
    }

    public tecData = {};
    public init(data){
        this.tecData = data;
        //通用
        //等级：第一级￥，第二级3道具，+1
        //等级，生命。奴隶数量，卡牌上限
        //

        //一个开始挂机就有3个资源


        //4个矿 金 + 3个资源     3个资源加成位
        //1个矿 + 资源加成

        //4个科技   金 + 3个资源
        //2个科技，资源组合不同
    }

    //取这个等级每小时能得到的金币   openCoin:解锁金币
    public getCoinAdd(lv,openCoin){
        var base = openCoin;
        for(var i=1;i<lv;i++)
        {
            base += 3*i
        }
        //last + 3*lv
        return base;
    }

    //升到该级需要的金币
    public getCoinNeed(lv){
        var v1 = 2
        var v2 = 30
        var v3 = 50
        var base = 50;
        for(var i=1;i<lv;i++)
        {
            base += Math.pow(i+1,v1)*v2 - (i+1)*v3
        }
        return base;
        //last + power(lv,v1)*v2 - lv*v3
    }

    //升到该级需要的资源 type:1-3
    public getOtherNeed(lv,type){
        var v1 = 1.1
        var v2 = [1.8,1.5,1.2][type-1]
        var base = 2;
        for(var i=1;i<lv;i++)
        {
            base += Math.pow(i+1,v1)*v2
        }
        return Math.floor(base)
    }

    //取得列表
    public getListByType(type){
        var data = TecVO.data;
        var lv =  this.getLevel(1);
        var arr = [];
        for(var s in data)
        {
            var vo = data[s];
            if(vo.type == type && vo.level <= lv)
                arr.push(vo);
        }
        return arr;
    }

    //取对应等级
    //通用的默认都是1级
    public getLevel(id){
        if(TecVO.getObject(id).type == 1)
            return this.tecData[id] || 1;
        return this.tecData[id] || 0;
    }

    //取升级对应花费
    public getLevelUpCost(id){
        var arr = []
       var lv = this.getLevel(id);
        var vo = TecVO.getObject(id);
        var coin = this.getCoinNeed(lv + vo.coinlv + vo.step*lv) //需要的钱
        arr.push({type:'coin',num:coin});
        var idAdd = 0
        if(vo.type == 1)//通用类型需要的道具会变化
        {
            idAdd += lv - 1;
        }
        if(vo.prop1)
            arr.push({type:'prop',id:vo.prop1 + idAdd,num:this.getOtherNeed(lv,1)});
        if(vo.prop2)
            arr.push({type:'prop',id:vo.prop2 + idAdd,num:this.getOtherNeed(lv,2)});
        if(vo.prop3)
            arr.push({type:'prop',id:vo.prop3 + idAdd,num:this.getOtherNeed(lv,3)});
        return arr;
    }

    public testRed(id){
         var arr = this.getLevelUpCost(id);
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.type == 'coin')
            {
                if(UM.getCoin()< oo.num)
                    return false
            }
            else if(oo.type == 'prop')
            {
                if(PropManager.getInstance().getNum(oo.id)< oo.num)
                    return false
            }
        }
        return true;
    }


    public tec_up(id,fun?) {
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.tec.tec_up, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("升级失败");
                TecInfoUI.getInstance().renew();
                return;
            }
            if (fun)
                fun();
        });
    }
}