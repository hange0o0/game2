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

    public pk(fun?){
        if(PKManager.getInstance().stopPK())
            return;
        if(!UM.testEnergy(1))
            return;
        var oo:any = {};
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

            if (fun)
                fun();
        },true,1,true);
    }

}