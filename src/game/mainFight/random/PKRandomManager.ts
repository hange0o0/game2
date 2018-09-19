class PKRandomManager {
    private static instance:PKRandomManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKRandomManager();
        return this.instance;
    }

    public questionData
    public info

    public cardList = []

    public getActiveInfo(){
        return {
            index:this.info.index,
            num:this.info.num,
            haveAward:this.info.get_final_award,
            win_award:MyTool.getAwardArr(this.info.win_award)
        }
    }

    public getCard(){
        var id = ArrayUtil.randomOne(this.cardList)
        while(id == 268 || id == 269 || id == 270)
            id = ArrayUtil.randomOne(this.cardList)
        return id;
    }

    private setCard(){
        this.cardList = CardManager.getInstance().getOpenMonsterList(0).concat(CardManager.getInstance().getOpenSkillList(0));
        for(var i=0;i<this.cardList.length;i++)
        {
            this.cardList[i] =  this.cardList[i].id;
        }
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
        Net.send(GameEvent.random.get_random,oo,(data) =>{
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
        var oo:any = {
            index:this.info.index + 1
        };
        Net.addUser(oo);
        Net.send(GameEvent.random.random_pk,oo,(data) =>{
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
            this.setCard();
            this.info.num --;

            //var arr = [];
            //while(arr.length<6)
            //    arr.push(this.getCard())
            //msg.pkdata.players[0].card = arr.join(',')
            PKManager.getInstance().startPK(PKManager.TYPE_RANDOM,msg.pkdata)
            if(fun)
                fun();
        });
    }

    public pkResult(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.random.random_pk_result, oo, (data)=> {
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


    public addChance(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.random.add_chance, oo, (data)=> {
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
        Net.send(GameEvent.random.final_award, oo, (data)=> {
            var msg = data.msg;
            this.info.get_final_award = true;
            if(msg.fail)
            {
                MyWindow.Alert('无法领奖，错误码：' + msg.fail)
                return;
            }
            AwardUI.getInstance().show(msg.award)
            this.info.win_award = msg.award;
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        });
    }

}