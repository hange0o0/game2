class HeroManager {
    private static _instance:HeroManager;
    public static getInstance():HeroManager {
        if (!this._instance)
            this._instance = new HeroManager();
        return this._instance;
    }

    public heroData = {}
    public levelBase = [0,1,10,30,60,110]


    public isHeroOpen(){
        return HangManager.getInstance().level >= Config.heroLevel;
    }

    public init(hero){
        this.heroData = hero || {};
    }


    public getHero(id){
         return this.heroData[id] || 0;
    }

    public getHeroLevel(id){
         var num =  this.getHero(id);
        if(!num)
            return 0;
        for(var i=5;i>=0;i--)
        {
             if(num >= this.levelBase[i])
                return i
        }
        return 0;
    }

    public getTotalHeroList(){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.id > 100 && vo.id < 130)
                arr.push(vo);
        }
        return arr;
    }

    public getMyHeroList(){
        var arr = [];
        for(var s in this.heroData)
        {
            var vo =  MonsterVO.getObject(s);
            vo.temp = this.getHeroLevel(vo.id);
            arr.push(vo);
        }
        return arr;
    }




    //public card_buy(id,fun?){
    //    var oo:any = {};
    //    oo.id = id;
    //    Net.addUser(oo);
    //    Net.send(GameEvent.card.card_buy,oo,(data) =>{
    //        var msg = data.msg;
    //        if(msg.fail)
    //        {
    //            MyWindow.Alert('兑换失败，错误代码：' + msg.fail)
    //            return;
    //        }
    //        MyWindow.ShowTips('兑换成功！')
    //        this.skillList[msg.id] = true;
    //        EM.dispatch(GameEvent.client.card_change);
    //        if(fun)
    //            fun();
    //    });
    //}




}