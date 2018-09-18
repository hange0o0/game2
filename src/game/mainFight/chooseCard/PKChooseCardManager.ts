class PKChooseCardManager {
    private static instance:PKChooseCardManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKChooseCardManager();
        return this.instance;
    }

    public maxNum = 20;
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
        SharedObjectManager.getInstance().setMyValue('chooseCard_video',{})
        PKBeforeUI.getInstance().show({
            title:'组建阵容',
            stopAdd:true,
            noTab:true,
            stopTest:true,
            chooseCard:true,
            maxNum:this.maxNum,
            cardBase:{force:1000,type:UM.type},
            stopRemoveTips:true,
            newList:true,
            list:this.info.cardlist,
            fun:function(data){
                PKChooseCardManager.getInstance().pos(data,()=>{
                    PKChooseCardManager.getInstance().pk()
                })
            },
            hideFun:function(data,hero){
                PKChooseCardManager.getInstance().pos(data)
            }
        })
    }

    public onPKBtn(){
        var history = SharedObjectManager.getInstance().getMyValue('chooseCard_video') || {}
        PKBeforeUI.getInstance().show({
            title:'挑战关卡',
            stopAdd:true,
            noTab:true,
            stopTest:true,
            maxNum:this.maxNum,
            stopRemoveTips:true,
            cardBase:{force:1000,type:UM.type},
            list:this.info.cardlist,
            otherList:history.otherList,
            history:history.history,
            fun:function(data){
                PKChooseCardManager.getInstance().pos(data,()=>{
                    PKChooseCardManager.getInstance().pk()
                })
            },
            hideFun:function(data,hero){
                PKChooseCardManager.getInstance().pos(data)
            }
        })
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

    public setCard(id,fun?){
        var oo:any = {id:id};
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.set_choosecard,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("数据异常，错误码：" + msg.fail);
                return;
            }
            this.info.choose = msg.choose
            if(this.info.cardlist)
                this.info.cardlist += ',' + id
            else
                this.info.cardlist = id + ''

            if(!this.info.choose)
                EM.dispatch(GameEvent.client.active_change)

            BasePosUI.getInstance().renewPKChooseCard(id,msg.choose)
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
            SharedObjectManager.getInstance().setMyValue('chooseCard_video',{})

            this.info.index++
            this.info.num++
            this.info.win_award = msg.win_award;
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        },true,1,true);
    }


    public pos(list,fun?) {
        var oo:any = {list:list};
        if(list == this.info.cardlist)
        {
            fun && fun();
            return
        }
        Net.addUser(oo);
        Net.send(GameEvent.choosecard.pos_choosecard, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('保存阵容出错，错误码：' + msg.fail)
                return;
            }
            this.info.cardlist = msg.list;
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
            this.info.choose = msg.choose;
            this.info.cardlist = '';
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