class HeroManager {
    private static _instance:HeroManager;
    public static getInstance():HeroManager {
        if (!this._instance)
            this._instance = new HeroManager();
        return this._instance;
    }

    public heroData = {}
    public heroLVData = {}
    public levelBase = [0,1,10,30,60,110]


    public isHeroOpen(){
        return HangManager.getInstance().level >= Config.heroLevel;
    }

    public init(msg){
        this.heroData = msg.hero || {};
        this.heroLVData = msg.herolv || {};
    }

    public isRed(){
        var arr = this.getMyHeroList();
        var pnum = PropManager.getInstance().getNum(101);
        for(var i=0;i<arr.length;i++)
        {
            var oo = arr[i];
            var lv = HeroManager.getInstance().getHeroLevel(oo.id);
            if(lv<HeroManager.getInstance().getHeroMaxLevel(oo.id) &&  pnum>= lv)
            {
                return true
            }
        }
        return false;
    }

    public isFull(){
        var data = MonsterVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(!vo.isHero())
                continue;
            if(vo.getHeroLevel() > UM.level)
                continue;
            if(this.getHeroLevel(vo.id) == 5)
                continue;
            return false;
        }
        return true
    }


    public getHero(id){
         return this.heroData[id] || 0;
    }

    public getHeroLevel(id){
         if(this.heroLVData[id])
            return this.heroLVData[id]
        if(this.getHero(id))
            return 1
        return 0;
    }
    public getHeroMaxLevel(id,num?){
         num = num || this.getHero(id);
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
            if(vo.isHero())
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

    public hero_up(id,fun?) {
        var self = this;
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.hero.hero_up, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("进化失败，错误码：" + msg.fail);
                return;
            }
            SoundManager.getInstance().playEffect(SoundConfig.effect_u_up);
            if (fun)
                fun();
        });
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