class MailManager {
    private static _instance:MailManager;

    public static getInstance():MailManager {
        if (!this._instance)
            this._instance = new MailManager();
        return this._instance;
    }
    //消息type的类型说明：
    //1:成为主人
    //2:抢奴隶
    //101:系统奖励

    public mailData;
    public mailEffectTime = 3*24*3600//有效时间

    public constructor() {
        this.mailData = SharedObjectManager.getInstance().getMyValue('mailData') || {list:[],time:0};
        var t = TM.now();
        for(var i=0;i<this.mailData.list.length;i++)
        {
            var oo = this.mailData.list[i];
            if(parseInt(oo.time) + this.mailEffectTime < t)
            {
                this.mailData.list.splice(i,1);
                i--;
            }
        }
    }

    public saveData(){
        SharedObjectManager.getInstance().setMyValue('mailData',this.mailData);
    }

    public getMailDes(data){
        var content = JSON.parse(data.content);
        switch(parseInt(data.type))
        {
            case 1:
                return '从现在起我就是你的主人了，好好为我效力吧'
            case 2:
                return '你的奴隶【'+Base64.decode(content.slave_nick)+'】看着还不错，我就拿去了'
            case 101:
                return '系统给你发奖罗~'
        }
    }

    //取type为XXXX的数据
    public getListByTpyes(typeArr){
        var arr = [];
        for(var i=0;i<this.mailData.list.length;i++)
        {
            var oo = this.mailData.list[i];
            if(ArrayUtil.indexOf(typeArr,oo.type) != -1)
            {
                arr.push(oo);
            }
        }
        return arr;
    }

    public getMail(fun?){
        if(TM.now() - this.mailData.time < 30*60)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.msgtime = this.mailData.msgtime || 0
        Net.addUser(oo);
        Net.send(GameEvent.mail.get_mail,oo,(data) =>{
            var msg = data.msg;
            if(msg.list)
            {
                this.mailData.list = this.mailData.list.concat(msg.list)
                ArrayUtil.sortByField(this.mailData.list,['time'],[1])
                if(this.mailData.list[0])
                    this.mailData.msgtime = this.mailData.list[0].time;
                this.saveData()
            }
            if(fun)
                fun();
        });
    }

    public get_mail_award(mailObj,fun?){
        var oo:any = {};
        oo.id = mailObj.id
        Net.addUser(oo);
        Net.send(GameEvent.mail.get_mail_award,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('领取失败，错误代码：' + msg.fail)
                return;
            }
            mailObj.stat = 1;
            AwardUI.getInstance().show(msg.award)
            this.saveData();
            EM.dispatch(GameEvent.client.mail_change);
            if(fun)
                fun();
        });
    }
}