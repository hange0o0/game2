class TecManager {
    private static _instance:TecManager;
    public static getInstance():TecManager {
        if (!this._instance)
            this._instance = new TecManager();
        return this._instance;
    }

    public maxMainLevel = 20
    public tecData = {};

    public red1 = false
    public red2 = false
    public red3 = false
    public red4 = false
    public init(data){
        this.tecData = data;
    }

    public resetAllRed(){
        this.red1 = false
        this.red2 = false
        this.red3 = false
        this.red4 = false
    }



    public isTecRed(){
        var arr = this.getListByType(1)
        for(var i=0;i<arr.length;i++)
        {
            if(TecManager.getInstance().testRed(arr[i].id))
                return true;
        }
        return false;
    }

    public isForceRed(){
        var arr = this.getListByType(2)
        for(var i=0;i<arr.length;i++)
        {
            if(TecManager.getInstance().testRed(arr[i].id))
                return true;
        }
        return false;
    }

    public isCoinRed(){
        var arr = this.getListByType(3)
        for(var i=0;i<arr.length;i++)
        {
            if(TecManager.getInstance().testRed(arr[i].id))
                return true;
        }
        return false;
    }

    public isResourceRed(){
        var arr = this.getListByType(4)
        for(var i=0;i<arr.length;i++)
        {
            if(TecManager.getInstance().testRed(arr[i].id))
                return true;
        }
        return false;
    }



    public getHp(){
        return 2 + this.getLevel(2);
    }

    //取这个等级每小时能得到的金币
    public getCoinAdd(id,lv){
        var vo = TecVO.getObject(id);
        return this.getTecValue(lv+vo.coinlv-1,20,10);
    }

    public getForceAdd(id,lv){
        var vo = TecVO.getObject(id);
        return this.getTecValue(lv+vo.coinlv-1,1.5);
    }

    private getTecValue(lv,step,base=1){
        if(lv == 0)
            return 0;
        for(var i=1;i<lv;i++)
        {
            base += Math.max(1,Math.floor(step*i))
        }
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
        var v1 = 1.2
        var v2 = [2.2,2,1.8][type-1]
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
            if(vo.type == type && (vo.level <= lv || type == 1))
                arr.push(vo);
        }
        return arr;
    }

    //取对应等级
    //通用的默认都是1级
    public getLevel(id){
        if(this.tecData[id])
            return this.tecData[id];
        if(TecVO.getObject(id).type == 1)
            return 1;
        return 0;
    }

    //取升级对应花费
    public getLevelUpCost(id,lv?){
        var arr = []
       var lv = lv || this.getLevel(id);
        var vo = TecVO.getObject(id);
        var idAdd = 0
        if(vo.type == 1)//通用类型需要的道具会变化
        {
            idAdd += lv - 1;
            if(id != 1)
            {
                var nextLevel = lv* vo.level;
                arr.push({type:'lv',num:nextLevel});
            }
            else
            {
                arr.push({type:'prop',id:101,num:lv});
                arr.push({type:'hang',num:PropVO.getObjectByTec(lv+1).hanglevel});
            }
        }


        var coin = this.getCoinNeed((lv + vo.coinlv - 1)*(0.8+vo.step + vo.coinlv/200)) //需要的钱
        arr.push({type:'coin',num:coin});

        if(vo.prop1)
            arr.push({type:'prop',id:vo.prop1 + idAdd,num:this.getOtherNeed(lv,1)});
        if(vo.prop2)
            arr.push({type:'prop',id:vo.prop2 + idAdd,num:this.getOtherNeed(lv,2)});
        if(vo.prop3)
            arr.push({type:'prop',id:vo.prop3 + idAdd,num:this.getOtherNeed(lv,3)});
        return arr;
    }

    public testRed(id){
        if(id == 1 && this.getLevel(1) >= this.maxMainLevel)
            return false;
         var arr = this.getLevelUpCost(id);
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            if(oo.type == 'coin')
            {
                if(UM.getCoin()< oo.num)
                    return false
            }
            else if(oo.type == 'lv')
            {
                if(this.getLevel(1)< oo.num)
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

    public getTotalLevel(type){
        var count = 0;
        for(var s in this.tecData)
        {
            if(TecVO.getObject(s).type == type)
                count += this.tecData[s]
        }
        return count;
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
                MyWindow.Alert("升级失败，错误码：" + msg.fail);
                this.tecData[id] = msg.level;
                TecInfoUI.getInstance().renew();
                return;
            }

            SoundManager.getInstance().playEffect(SoundConfig.effect_u_up);
            if (fun)
                fun();
        });
    }
}