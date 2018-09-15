class PKAnswerManager {
    private static instance:PKAnswerManager;

    public static getInstance() {
        if (!this.instance) this.instance = new PKAnswerManager();
        return this.instance;
    }

    public questionData
    public info


    public getActiveInfo(){
        return {
            index:this.info.index,
            num:this.info.num,
            haveAward:!this.info.final_award,
            win_award:MyTool.getAwardArr(this.info.win_award)
        }
    }

    public getInfo(fun?){
        if(this.questionData)
        {
            if(fun)
                fun()
            return;
        }

        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.answer.get_answer,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert("数据异常，错误码：" + msg.fail);
                return;
            }
            this.questionData = msg.question
            this.info = msg.info
            if(fun)
                fun();
        });
    }

    public pk(fun?,userlist?){
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var data = this.getActiveInfo()
        var active = PKActiveManager.getInstance().getCurrentActive()
        var oo:any = {
            userlist:userlist,
            path:active.v1,
            index:data.index+1,
        };
        Net.addUser(oo);
        Net.send(GameEvent.answer.answer_pk,oo,(data) =>{
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
            PKManager.getInstance().startPK(PKManager.TYPE_ANSWER,msg.pkdata)
            if(fun)
                fun();
        });
    }

    public pkResult(fun?) {
        var oo:any = {};
        oo.list = PKData.getInstance().myPlayer.posHistory.join(',');
        PKManager.getInstance().addPKKey(oo)
        Net.send(GameEvent.answer.answer_pk_result, oo, (data)=> {
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

            SharedObjectManager.getInstance().setMyValue('answer_video',{})
            EM.dispatch(GameEvent.client.active_change)
            if (fun)
                fun();
        },true,1,true);
    }


    public addChance(fun?) {
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.answer.add_chance, oo, (data)=> {
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
        Net.send(GameEvent.answer.final_award, oo, (data)=> {
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