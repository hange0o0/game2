class CardManager {
    private static _instance:CardManager;
    public static getInstance():CardManager {
        if (!this._instance)
            this._instance = new CardManager();
        return this._instance;
    }

    public skillList = {}
    public monsterList = {}

    public skillCost = 30;

    public init(msg){
        var data = MonsterVO.data;
        for(var s in data)
        {
            if(data[s].level == 0)
                  this.monsterList[s] = true;
        }

        var data = SkillVO.data;
        for(var s in data)
        {
            if(data[s].level == 0)
                this.skillList[s] = true;
        }

        for(var s in msg.monster)
            this.monsterList[msg.monster[s]] = true;

        for(var s in msg.skill)
            this.skillList[msg.skill[s]] = true;
    }

    public getTotalMonsterList(type){
        var arr = [];
        var data = MonsterVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.level >= 999)
                continue
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getTotalSkillList(type){
        var arr = [];
        var data = SkillVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.level >= 999)
                continue
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getMyMonsterList(type){
        var arr = [];
        for(var s in this.monsterList)
        {
            var vo =  MonsterVO.getObject(s);
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getMySkillList(type){
        var arr = [];
        for(var s in this.skillList)
        {
            var vo =  SkillVO.getObject(s);
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }
    public getOpenSkillList(type){
        var arr = [];
        var data = SkillVO.data;
        var level = TecManager.getInstance().getLevel(1);
        for(var s in data)
        {
            if(type && type != data[s].type)
                continue;
            if(data[s].level <= level)
                arr.push(data[s]);
        }
        return arr;
    }

    //public getUpMonsterList(){
    //    var data = MonsterVO.data;
    //    for(var s in data)
    //    {
    //        //if(data[s].level <= UM.level+1)
    //        //    this.monsterList.push(parseInt(s));
    //    }
    //}
    //
    //public getUpSkillList(){
    //    var data = SkillVO.data;
    //    for(var s in data)
    //    {
    //        //if(data[s].level <= UM.level+1)
    //        //    this.skillList.push(parseInt(s));
    //    }
    //}

    public getUpCoin(id){
        var vo = MonsterVO.getObject(id)
        return Math.floor(Math.pow(vo.level,3.05)*100);
    }


    public card_buy(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.card.card_buy,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('兑换失败，错误代码：' + msg.fail)
                return;
            }
            MyWindow.ShowTips('兑换成功！')
            this.skillList[msg.id] = true;
            EM.dispatch(GameEvent.client.card_change);
            if(fun)
                fun();
        });
    }

    public card_open(id,fun?){
        var oo:any = {};
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.card.card_open,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('解锁失败，错误代码：' + msg.fail)
                return;
            }
            MyWindow.ShowTips('解锁成功！')
            this.monsterList[msg.id] = true;
            EM.dispatch(GameEvent.client.card_change);
            if(fun)
                fun();
        });
    }

    public card_draw(fun?){
        var oo:any = {};
        Net.addUser(oo);
        Net.send(GameEvent.card.card_draw,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('抽取失败，错误代码：' + msg.fail)
                return;
            }
            this.skillList[msg.id] = true;
            EM.dispatch(GameEvent.client.card_change);
            CardDrawResultUI.getInstance().show(msg);
            if(fun)
                fun();
        });
    }


}