class FightManager {
    private static instance:FightManager;

    public static getInstance() {
        if (!this.instance) this.instance = new FightManager();
        return this.instance;
    }

    //public shopTime
    //public shopData
    //public num
    //public step
    public card
    public enemy
    public hero
    public award
    //public value

    public info

    public cost = 100;

    private renewInfo(info){
        this.info = info
        //this.num = info.num
        //this.step = info.step
        if(info.card)
            this.card = info.card.split(',')
        else
            this.card = [];

        if(info.hero)
            this.hero = info.hero.split(',')
        else
            this.hero = [];

        this.enemy = info.enemy
        this.award = info.award
        //this.value = info.value
    }

    public onPKBtn(){
         if(this.info.init)
            this.continuePK();
        else
            this.startInit();
    }

    public startInit(){
        var FM = FightManager.getInstance();
        PKBeforeUI.getInstance().show({
            title:'初始阵容',
            noTab:true,
            stopTest:true,
            stopRemoveTips:true,
            list:SharedObjectManager.getInstance().getMyValue('fightDefault') || PKManager.getInstance().getDefaultPKList(),
            hero:SharedObjectManager.getInstance().getMyValue('hero') || PKManager.getInstance().getDefaultPKHero(),
            fun:function(data,hero){
                var arr = data.split(',')
                if(arr.length < PosManager.getInstance().maxPosNum())
                {
                    MyWindow.Confirm('还可继续上阵卡牌，确定就这样出战吗？',(b)=>{
                        if(b==1)
                        {
                            FM.initFight(data,hero);
                        }
                    })
                    return;
                }
                SharedObjectManager.getInstance().setMyValue('fightDefault',data)
                SharedObjectManager.getInstance().setMyValue('fightHero',hero)
                FM.initFight(data,hero)
            },
            hideFun:function(data,hero){
                if(data)
                    SharedObjectManager.getInstance().setMyValue('fightDefault',data)
                if(hero)
                    SharedObjectManager.getInstance().setMyValue('fightHero',hero)
            }
        })
    }

    public continuePK(){
        var FM = FightManager.getInstance();
        var history = SharedObjectManager.getInstance().getMyValue('fight_video') || {}
        PKBeforeUI.getInstance().show({
            stopAdd:true,
            title:'调整阵容',
            fight:true,
            noTab:true,
            newList:true,
            stopTest:true,
            otherList:history.otherList,
            history:history.history,
            list:FM.card.join(','),
            hero:FM.hero.join(','),
            fun:function(data,hero){
                if(FM.award)
                {
                    FightAwardUI.getInstance().show();
                    return;
                }
                FM.changePos(data,hero,()=>{
                    FM.pk()
                })
            },
            hideFun:function(data,hero){
                FM.changePos(data,hero)
            }
        })
    }

    public getActiveInfo(){
        return {
            index:this.info.index,
            init:this.info.init,
            num:this.card.length,
            haveAward:this.info.get_final_award,
            win_award:MyTool.getAwardArr(this.info.win_award)
        }
    }

    //加入新队伍
    public getAward(list,fun?)
    {
        var oo:any = {};
        oo.list = list;
        Net.addUser(oo);
        Net.send(GameEvent.fight.fight_award, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('选取卡牌失败，错误码：' + msg.fail)
                return;
            }
            this.card = this.card.concat(list);
            BasePosUI.getInstance().renewFightChooseCard(list)
            this.award = '';
            EM.dispatchEventWith(GameEvent.client.active_change)
             fun && fun();
        });
    }

    //初始化队伍
    public initFight(list,hero,fun?)
    {
        if(!UM.testEnergy(1))
            return;
        //if(diamond && !UM.testDiamond(100))
        //    return;

        var oo:any = {};
        oo.list = list;
        oo.hero = hero;
        Net.addUser(oo);
        Net.send(GameEvent.fight.init_fight, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('初始队伍失败，错误码：' + msg.fail)
                return;
            }

            this.info.init = true;
            this.card = list.split(',');
            this.hero = hero.split(',');
            //this.step = 0;
            SharedObjectManager.getInstance().setMyValue('fight_video','')
            EM.dispatchEventWith(GameEvent.client.active_change)
            //SharedObjectManager.getInstance().removeMyValue('fightDefault');
            this.pk();
            fun && fun();
        });
    }

    public getInfo(fun?){
        if(this.info)
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
            if(fun)
                fun();
        });
    }


    //public buy_shop(id,fun?){
    //    var oo:any = {};
    //    oo.id = id;
    //    Net.addUser(oo);
    //    Net.send(GameEvent.fight.buy_shop,oo,(data) =>{
    //        var msg = data.msg;
    //        if(msg.fail)
    //        {
    //            MyWindow.Alert("购买失败，错误码：" + msg.fail);
    //            this.shopTime = 0;
    //            this.getInfo(()=>{
    //                FightInfoUI.getInstance().renew();
    //            })
    //            return;
    //        }
    //        for(var i=0;i<this.shopData.length;i++)
    //        {
    //            if(this.shopData[i].key == id)
    //            {
    //                this.shopData[i].isbuy = true;
    //                break;
    //            }
    //        }
    //        this.value -=  this.shopData[i].diamond;
    //        AwardUI.getInstance().show(msg.award)
    //        EM.dispatchEventWith(GameEvent.client.fight_change)
    //        SoundManager.getInstance().playEffect(SoundConfig.effect_buy);
    //        if(fun)
    //            fun();
    //    });
    //}

    public pk(fun?) {
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var self = this;
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.fight.pk_fight, oo, function (data) {
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('体力不足')
                return;
            }
            if(msg.fail)
            {
                MyWindow.Alert('PK初始异常，错误码：' + msg.fail)
                return;
            }
            PKManager.getInstance().startPK(PKManager.TYPE_FIGHT,msg.pkdata)
            if (fun)
                fun();
        });
    }

    public pkFail(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        Net.addUser(oo);
        Net.send(GameEvent.fight.pk_fail, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('出错了，错误码：' + msg.fail)
                return;
            }
            if(msg.card)
                this.card = msg.card.split(',')
            else
                this.card = []
            EM.dispatchEventWith(GameEvent.client.active_change)
            if (fun)
                fun();
        });
    }

    //public fightCancel(fun?) {
    //    var oo:any = {};
    //    Net.addUser(oo);
    //    Net.send(GameEvent.fight.fight_cancel, oo, (data)=> {
    //        var msg = data.msg;
    //        this.award = '';
    //        this.card.length = 0
    //        this.step = 0
    //        EM.dispatchEventWith(GameEvent.client.fight_change)
    //        if (fun)
    //            fun();
    //    });
    //}


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
            if(msg.card)
                this.card = msg.card.split(',')
            else
                this.card = []
            this.award = msg.cardaward;
            //this.value += msg.award.fightvalue
            this.info.index ++;
            this.info.win_award = msg.win_award;
            EM.dispatchEventWith(GameEvent.client.active_change)
            if (fun)
                fun();
        },true,1,true);
    }

    public changePos(list,hero,fun?){
        if(this.card.join(',') == list && this.hero.join(',') == hero)
        {
            fun && fun();
            return
        }
        var oo:any = {};
        oo.list = list;
        oo.hero = hero;
        Net.addUser(oo);
        Net.send(GameEvent.fight.change_pos,oo,(data)=>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('传入卡牌非法')
                return;
            }
            this.card = list.split(',')
            if(hero)
                this.hero = hero.split(',')
            if(fun)
                fun();
        });
    }

    public addChance(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.fight.add_chance, oo, (data)=> {
            var msg = data.msg;
            this.award = msg.award;
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        });
    }

    public finalAward(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.fight.final_award, oo, (data)=> {
            var msg = data.msg;
            this.info.get_final_award = true;
            if(msg.fail)
            {
                MyWindow.Alert('无法领奖，错误码：' + msg.fail)
                return;
            }
            this.info.win_award = msg.award;
            AwardUI.getInstance().show(msg.award)
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        });
    }
}