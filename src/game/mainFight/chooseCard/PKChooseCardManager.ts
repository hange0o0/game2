class PKChooseCardManager {
    private static instance:PKChooseCardManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKChooseCardManager();
        return this.instance;
    }

    public maxNum = 30;
    public info

    public getActiveInfo(){
        return {
            index:this.info.index,
            num:this.info.num,
            haveAward:!this.info.final_award,
            win_award:MyTool.getAwardArr(this.info.win_award)
        }
    }

    public onChooseBtn(){
        PKBeforeUI.getInstance().show({
            title:'组建阵容',
            stopAdd:true,
            noTab:true,
            stopTest:true,
            stopRemoveTips:true,
            list:this.info.chooselist,
            fun:function(data,hero){
                var arr = data.split(',')
                if(arr.length < PosManager.getInstance().maxPosNum())
                {
                    MyWindow.Confirm('还可继续上阵卡牌，确定就这样出战吗？',(b)=>{
                        if(b==1)
                        {
                            FM.initFight(data,hero,diamond);
                        }
                    })
                    return;
                }
                SharedObjectManager.getInstance().setMyValue('fightDefault',data)
                SharedObjectManager.getInstance().setMyValue('fightHero',hero)
                FM.initFight(data,hero,diamond)
            },
            hideFun:function(data,hero){
                if(data)
                    SharedObjectManager.getInstance().setMyValue('fightDefault',data)
                if(hero)
                    SharedObjectManager.getInstance().setMyValue('fightHero',hero)
            }
        })
    }

    public onPKBtn(){

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
        Net.send(GameEvent.choosecard.get_choosecard,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("数据异常，错误码：" + msg.fail);
                return;
            }
            this.info = msg.info
            if(fun)
                fun();
        });
    }

    public setCard(card,fun?){
        var oo:any = {card:card};
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.set_choosecard,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("数据异常，错误码：" + msg.fail);
                return;
            }
            this.info = msg.info
            if(fun)
                fun();
        });
    }

    public pk(fun?){
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var data = this.getActiveInfo()
        var active = PKActiveManager.getInstance().getCurrentActive()
        var oo:any = {
            path:active.v1,
            index:data.index+1,
        };
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.choosecard_pk,oo,(data) =>{
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
            this.info.num --;
            EM.dispatch(GameEvent.client.active_change)
            PKManager.getInstance().startPK(PKManager.TYPE_CHOOSECARD,msg.pkdata)
            if(fun)
                fun();
        });
    }

    public pkResult(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.choosecard.choosecard_pk_result, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;

            this.info.index++
            this.info.num++
            this.info.win_award = msg.win_award;
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        },true,1,true);
    }


    public pos(list,fun?) {
        var oo:any = {};
        if(list == this.info.chooselist)
        {
            fun && fun();
            return
        }
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.pos_choosecard, oo, (data)=> {
            var msg = data.msg;
            this.info.chooselist = msg.list;
            if (fun)
                fun();
        });
    }
    public addChance(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.add_chance, oo, (data)=> {
            var msg = data.msg;
            this.info.num = msg.num;
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        });
    }

    public award(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.final_award, oo, (data)=> {
            var msg = data.msg;
            delete this.info.final_award
            if(msg.fail)
            {
                MyWindow.Alert('无法领奖，错误码：' + msg.fail)
                return;
            }
            AwardUI.getInstance().show(msg.award)
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        });
    }

}