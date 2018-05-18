class FightManager {
    private static instance:FightManager;

    public static getInstance() {
        if (!this.instance) this.instance = new FightManager();
        return this.instance;
    }

    public shopTime
    public shopData
    public num
    public level
    public maxlevel
    public step
    public card
    public enemy
    public award
    public value

    public cost = 100;

    private renewInfo(info){
        this.num = info.num
        this.level = info.level
        this.maxlevel = info.maxlevel
        this.step = info.step
        if(info.card)
            this.card = info.card.split(',')
        else
            this.card = [];

        this.enemy = info.enemy
        this.award = info.award
        this.value = info.value
    }

    //加入新队伍
    private getAward(list,fun)
    {
        var oo:any = {};
        oo.list = list;
        Net.addUser(oo);
        Net.send(GameEvent.fight.fight_award, oo, (data)=> {
            var msg = data.msg;
             fun && fun();
        });
    }

    //初始化队伍
    public initFight(list,diamond?,fun?)
    {
        if(!UM.testEnergy(1))
            return;
        if(diamond && !UM.testDiamond(100))
            return;

        var oo:any = {};
        oo.list = list;
        oo.diamond = diamond;
        Net.addUser(oo);
        Net.send(GameEvent.fight.init_fight, oo, (data)=> {
            var msg = data.msg;
            this.card = list;
            SharedObjectManager.getInstance().removeMyValue('fightDefault');
            this.pk();
            fun && fun();
        });
    }

    public getInfo(fun?){
        if(this.shopTime && DateUtil.isSameDay(this.shopTime))
        {
            if(fun)
                fun()
            return;
        }
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.fight.get_fight,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("数据异常，错误码：" + msg.fail);
                return;
            }
            this.renewInfo(msg.info);
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
        Net.send(GameEvent.fight.buy_shop,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("购买失败，错误码：" + msg.fail);
                this.shopTime = 0;
                this.getInfo(()=>{
                    ShopUI.getInstance().renew();
                })
                return;
            }
            for(var i=0;i<this.shopData.length;i++)
            {
                if(this.shopData[i].id == id)
                {
                    this.shopData[i].isbuy = true;
                    break;
                }
            }
            SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
            if(fun)
                fun();
        });
    }

    public pk(fun?) {
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.fight.pk_fight, oo, function (data) {
            var msg = data.msg;
            PKManager.getInstance().startPK(PKManager.TYPE_FIGHT,msg.pkdata)
            if (fun)
                fun();
        });
    }


    public pkResult(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.fight.pk_fight_result, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;
            if (fun)
                fun();
        });
    }

    public changePos(list,fun?){
        var self = this;
        var oo:any = {};
        oo.list = list;
        Net.addUser(oo);
        Net.send(GameEvent.fight.change_pos,oo,function(data){
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('传入卡牌非法')
                return;
            }
            if(fun)
                fun();
        });
    }
}