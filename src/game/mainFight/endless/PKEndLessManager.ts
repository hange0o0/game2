class PKEndLessManager {
    private static instance:PKEndLessManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKEndLessManager();
        return this.instance;
    }

    public info

    public getActiveInfo(){
        return {
            index:this.info.index,
            num:this.info.num,
            haveAward:!this.info.final_award,
            win_award:MyTool.getAwardArr(this.info.win_award)
        }
    }


    public onPKBtn(){
        var history = SharedObjectManager.getInstance().getMyValue('endless_video') || {}
        if(history.time && history.time < PKActiveManager.getInstance().getCurrentActive().start)
        {
            SharedObjectManager.getInstance().setMyValue('endless_video',{})
            history = {};
        }
        PKBeforeUI.getInstance().show({
            title:'挑战关卡',
            otherList:history.otherList,
            history:history.history,
            fun:function(id){
                PKEndLessManager.getInstance().pk(id)
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
        Net.send(GameEvent.endless.get_endless,oo,(data) =>{
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

    public pk(id,fun?){
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var data = this.getActiveInfo()
        var active = PKActiveManager.getInstance().getCurrentActive()
        var oo:any = {
            id:id,
            index:data.index+1,
        };
        Net.addUser(oo);
        Net.send(GameEvent.endless.endless_pk,oo,(data) =>{
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
            PKManager.getInstance().startPK(PKManager.TYPE_ENDLESS,msg.pkdata)
            if(fun)
                fun();
        });
    }

    public pkResult(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.endless.endless_pk_result, oo, (data)=> {
            var msg = data.msg;
            if(msg.fail)
            {
                PKManager.getInstance().testFail(msg.fail)
                PKingUI.getInstance().hide();
                return;
            }
            PKManager.getInstance().pkResult = msg;

            SharedObjectManager.getInstance().setMyValue('endless_video',{})

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
        Net.send(GameEvent.endless.add_chance, oo, (data)=> {
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
        Net.send(GameEvent.endless.final_award, oo, (data)=> {
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