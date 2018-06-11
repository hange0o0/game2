class PKManager {
    public static TYPE_HANG = 1;
    public static TYPE_SLAVE = 2;
    public static TYPE_FIGHT = 3;


    public static TYPE_TEST = 101;
    public static TYPE_MAIN_HANG = 102; //挂机动画用

    private static instance:PKManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKManager();
        return this.instance;
    }



    public pkType;
    public pkResult;
    public recordList;
    public getRecordTime;
    public recordTime;


    constructor(){
        this.recordList = SharedObjectManager.getInstance().getMyValue('pk_replay1') || []
        this.recordTime = SharedObjectManager.getInstance().getMyValue('pk_record_time') || 0

        for(var i=0;i<this.recordList.length;i++)//去除录像版本不对的
        {
             if(this.recordList[i].version != Config.pk_version)
             {
                 this.recordList.splice(i,1);
                 i--;
             }
        }
        if(this.recordList.length > 20)
            this.recordList.length = 20;
    }

    public pkWord = ['投降，或者死亡','来战个痛快','小心你的背后','这招看你怎么躲','我要认真了','你就只会这几招吗','我要出大招了','我会赐予你死亡','你究竟想怎样...','我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的',
        '品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','尝尝我的厉害吧', '你会后悔对上我的' ,'希望你能多坚持一会吧','不要输得太难看哦','对面上来的是什么啊','我允许你认输','唯有一战了','胜利属于我们的',
        '我们来做个了结吧','你的身体有破绽','你空门大开啊','尝尝这个吧','接下...\n这一招吧','用这招....\n来决胜负吧', '马上将你解决掉', '就用你的死来结束吧','别罗嗦了...来吧','来啊!\n互相相害啊','求一败','抬走，下一个',
        '来个强点的','对面没人了吗','来让我战个痛快吧','哈哈哈','我的目标是要3胜','胜利是属于我的','你睡着了吗','你分心了','别小看我!','游戏结束了','满足了吗','到现在才来求饶吗',
        '浪费时间!!','想逃吗!真无聊!','你可别小看我啊!','你还未够资格','别惹我....!','任务保证完成','赢的人，\n是我','你太脆弱了','哦，是的！\n我要胜利了','抱歉','打得不错','发生这种事我很抱歉','对此我很抱歉','你敢盯着我看',
        '对面太弱了','威武','有希望了','想输都难','距离胜利又近一步了','看来我不用再出手了','燃烧吧！\n小宇宙！','我会让你后悔来到世上','严肃点，\n这是比赛','啦啦啦啦~',
        '我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的','祈祷别对上我吧','我的怒火\n会毁灭一切','噢，亲爱的\n要坚持住','你死定了','你们这是自寻死路','品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','你对力量一无所知',
        '这就是王者之气啊','刚才你们说什么来着','看到我们有多强了吧','等会去哪庆功好呢','留几个给我杀啊','放轻点，别把对面吓跑了','蠢材！','让我来干掉你....',
        '我要打呵欠了','让我好好抱抱你！','我准备好了','我已经等不及了','→_→','@_@','( ¯ □ ¯ )','（╯＾╰）','>_<','(╯▔▽▔)╯','(╬▔皿▔)凸', '到此为止了','别烦我!','还没有结束的～', '有点本事啊', '我绝不认输',
        '我只是变的更坚强了','我和你没完','不胜利毋宁死','死亡，没什么好怕的']


    public defaultCardList = '1,2,3,3,3,2,2,6,6,6,31,31,31,41,41,41,65,65,65,64';

    public getPKBG(){
        return this.getBG(HangManager.getInstance().getHangBGID())
    }

    public getBG(id){
        return Config.localResRoot + 'map/map'+(id || 1)+'.jpg';
    }

    public testFail(failID){
        MyWindow.Alert('PK异常！错误码：' + failID);
        return true;
        //switch(failID)
        //{
        //    case 101:
        //
        //        return true;
        //    case 102:
        //        MyWindow.Alert('PK异常！使用了无效的卡牌！');
        //        return true;
        //    case 103:
        //        MyWindow.Alert('PK异常！使用了无效的卡牌！');
        //        return true;
        //}
        //return false;
    }

    public getDefaultPKList(){
        var index = SharedObjectManager.getInstance().getMyValue('pk_choose')
        var data = PosManager.getInstance().getListByType('atk')[index];
        if(data && data.list)
            return data.list;
        return this.defaultCardList;
    }

    public sendResult(fun){
        if(PKData.getInstance().isReplay)
        {
            fun && fun();
            return;
        }
        this.pkResult = null;
        switch(this.pkType)
        {
            case PKManager.TYPE_HANG:
                HangManager.getInstance().pkResult(fun);
                break;
            case PKManager.TYPE_TEST:
                fun && fun();
                break;
            case PKManager.TYPE_SLAVE:
                SlaveManager.getInstance().slave_pk_result(fun);
                break;
            case PKManager.TYPE_FIGHT:
                FightManager.getInstance().pkResult(fun);
                break;
        }
    }
    public sendFail(fun){
        if(PKData.getInstance().isReplay)
        {
            fun && fun();
            return;
        }
        this.pkResult = null;
        switch(this.pkType)
        {
            case PKManager.TYPE_FIGHT:
                FightManager.getInstance().pkFail(fun);
                break;
            case PKManager.TYPE_HANG:
                var lastHistory = SharedObjectManager.getInstance().getMyValue('hang_video') || {};
                if(lastHistory.level === HangManager.getInstance().level)
                {
                    lastHistory.fail ++;
                }
                else
                {
                    lastHistory.level = HangManager.getInstance().level
                    lastHistory.fail = 0;
                }
                SharedObjectManager.getInstance().setMyValue('hang_video',lastHistory)
                fun && fun();
                break;
            default:
                fun && fun();
                break;
        }
    }

    public startPK(pkType,data){
        this.pkType = pkType;
        this.pkResult = null;
        var PD = PKData.getInstance();
        PD.init(data);
        PKingUI.getInstance().show();
    }

    public test(atk,def){
        var PD = PKData.getInstance()

        //攻击列表乱序
        var tempList = atk.list.split(',');
        var atkList:any = [];
        var b = true
        while(tempList.length > 0)
        {
            var temp = [];
            for(var i=0;i<6;i++)
            {
                var data = tempList.shift();
                if(!data)
                    break;
                if(b)
                    atkList.push(data)
                else
                    temp.push(data)
            }
            b = false;
            if(temp.length > 0)
            {
                ArrayUtil.random(temp,3)
                atkList = atkList.concat(temp)
            }
        }
        atkList = atkList.join(',')

        var pkData = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'npc',team:2,autolist:def.list,force:UM.tec_force,type:UM.type,hp:5,nick:def.name},
                {id:2,gameid:UM.gameid,team:1,card:atkList,force:UM.tec_force,nick:atk.name,type:UM.type,hp:5}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(pkData);
        PKingUI.getInstance().show();
    }

    public startPlay(){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'npc',team:2,autolist:'1,2,1,2,1,2,1,2',force:0,type:1,hp:5},
                {id:2,gameid:UM.gameid,team:1,card:'1,1,1,2,2,2,1,1,1',force:0,nick:'user',type:1,hp:5}
            ]
        };
        PD.init(data);
        PKingUI.getInstance().show();
    }

    public playReplay(data){
        var PD = PKData.getInstance()
        PD.init(data);
        PD.isReplay = true
        this.pkType = data.type;
        PKingUI.getInstance().show();
    }

    //PK的校验码
    public addPKKey(oo){
        var PD = PKData.getInstance()
        var card = PD.myPlayer.card;
        var cd = PD.actionTime

        oo.cd = PD.actionTime
        oo.key = md5.incode(cd + card).substr(-8)
        Net.addUser(oo)
    }

    //把录像保存到本地
    public savePKResult(){
        if(this.pkType > 100)
            return;
        var PD = PKData.getInstance()
        if(PD.isReplay)
            return;
        var data = ObjectUtil.clone(PD.baseData)
        data.version = Config.pk_version
        data.type = this.pkType;
        data.pktime = TM.now();
        data.result = PD.getPKResult();
        data.score = Math.max(0,PD.team1.hp) + ':' + Math.max(0,PD.team2.hp);
        for(var i=0;i<data.players.length;i++)
        {
            var players = data.players[i];
            //delete players.autolist;
            //delete players.card;
            if(players.autolist && !players.card)
                players.card = players.autolist
            players.actionlist = PD.getPlayer(players.id).posHistory.join(',');
        }
        this.recordList.unshift(data)

        SharedObjectManager.getInstance().setMyValue('pk_replay1',this.recordList)

        if(data.result == 1 && data.type == PKManager.TYPE_SLAVE)
        {
            var gameid = PD.myPlayer.teamData.enemy.members[0].gameid;
            setTimeout(()=>{
                this.sendPKRecord(gameid,data);
            },1000)

        }
    }

    private sendPKRecord(gameid,data)
    {
        var oo:any = {};
        oo.otherid = gameid;
        oo.pkdata = data;
        Net.addUser(oo);
        Net.send(GameEvent.pk.save_record, oo, (data)=> {

        });
    }

    public getPKRecord(fun?)
    {
        if(TM.now() - this.getRecordTime < 60*30)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.time = this.recordTime
        Net.addUser(oo);
        Net.send(GameEvent.pk.get_record, oo, (data)=> {
            var msg = data.msg;
            var list = msg.list || [];
            if(list.length > 0)
            {
                var b = false
                for(var i=0;i<list.length;i++)
                {
                    var oo = list[i];
                    oo.pkdata = JSON.parse(oo.pkdata);
                    if(oo.pkdata.version == Config.pk_version)
                    {
                        oo.pkdata.result = 2;//对方赢就是我输
                        this.recordList.push(oo.pkdata)
                        b = true
                    }
                    this.recordTime = Math.max(this.recordTime,oo.time);
                }
                if(b)
                {
                    ArrayUtil.sortByField(this.recordList,['pktime'],[1]);
                    SharedObjectManager.getInstance().setMyValue('pk_replay1',this.recordList)
                }
                SharedObjectManager.getInstance().setMyValue('pk_record_time',this.recordTime)
            }
            this.getRecordTime = TM.now();
            fun && fun();
        });
    }

    public sendPosToServer(posCard:PKPosCardData,fun?)
    {
        var oo:any = {};
        oo.posCard = posCard
        Net.addUser(oo);
        Net.send(GameEvent.pk.get_record, oo, (data)=> {
            var msg = data.msg;
            posCard.enableWaiting();
            fun && fun();
        });
    }
}