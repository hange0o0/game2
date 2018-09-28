class CardManager {
    private static _instance:CardManager;
    public static getInstance():CardManager {
        if (!this._instance)
            this._instance = new CardManager();
        return this._instance;
    }

    public skillList = {}
    public monsterList = {}
    public cardLike = {}

    public skillCost = 30;
    public maxSkill = 999;

    public init(msg){
        var data = MonsterVO.data;
        for(var s in data)
        {
            if(data[s].level == 0)
                  this.monsterList[s] = true;
        }

        var data = SkillVO.data;
        //for(var s in data)
        //{
        //    if(data[s].level == 0)
        //        this.skillList[s] = true;
        //}

        for(var s in msg.monster)
            this.monsterList[msg.monster[s]] = true;

        for(var s in msg.skill)
            this.skillList[s] = msg.skill[s];

        HeroManager.getInstance().init(msg)
    }

    public isRed(monsterType=0){
        var coin = UM.getCoin();
        var arr = this.getOpenMonsterList(monsterType)
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i].isLock && this.getUpCoin(arr[i].id) <= coin)
                return true;
        }
        return false;
    }

    public isOwnCard(id){
       if(CM.getCardVO(id).isMonster)
       {
           return this.monsterList[id]
       }
        return this.getSkillNum(id) > 0
    }

    public getSkillNum(id){
         return this.skillList[id] || 0
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
    public isSkillFull(){
        var data = SkillVO.data;
        for(var s in data)
        {
            var vo =  data[s];
            if(vo.level >= 999)
                continue
            if(vo.level > UM.level)
                continue
            if(this.getSkillNum(vo.id) >= 999)
                continue;
            return false;
        }
        return true;
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
            if(this.skillList[s] <= 0)
                continue;
            if(!type || type == vo.type)
                arr.push(vo);
        }
        return arr;
    }

    public getOpenMonsterList(type){
        var arr = [];
        var data = MonsterVO.data;
        var level = TecManager.getInstance().getLevel(1);
        for(var s in data)
        {
            if(type && type != data[s].type)
                continue;
            if(data[s].level <= level)
            {
                data[s].isLock = this.monsterList[s]?0:1
                arr.push(data[s]);
            }
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
        return Math.floor(Math.pow(vo.level,3.9)*100);    //要改成3.9
    }

    public resetOtherList(listData){

        if(typeof listData == 'string')
            return  listData.split(',');
        //list:lastArr.join(','),
        //    force:player.force,
        //    type:player.type,
        //    hero:player.hero
        var list = listData.list.split(',')
        for(var i=0;i<list.length;i++)
        {
            var oo:any = {};
            var vo = CM.getCardVO(list[i])
            if(!vo)
                continue;
            oo.id = list[i];
            oo.force = listData.force
            oo.type = listData.type
            if(vo.isHero())
            {
                oo.level = this.getHeroLV(oo.id,listData.hero)
                oo.isHero = true;
            }
            list[i] = oo;
        }
        return list;
    }

    private getHeroLV(id,data){
        var arr = data.split(',')
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split('|');
            if(temp[0] == id)
                return parseInt(temp[1]);
        }
        return 1;
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

    public getCardLike(id,fun?){
        if(this.cardLike[id] && TM.now() - this.cardLike[id].time < 60*3)
        {
            fun && fun();
            return;
        }
        var oo:any = {};
        oo.id = id;
        Net.send(GameEvent.card.card_like,oo,(data) =>{
            var msg = data.msg;
            this.cardLike[id] = msg.data;
            msg.data.like_num = parseInt(msg.data.like_num)
            msg.data.unlike_num = parseInt(msg.data.unlike_num)
            this.cardLike[id].time = TM.now();
            if(fun)
                fun();
        });
    }

    public setCardLike(id,like,fun?){
        var oo:any = {};
        oo.id = id;
        oo.like = like;
        Net.addUser(oo);
        Net.send(GameEvent.card.card_like_set,oo,(data) =>{
            var msg = data.msg;
            if(msg.fail)
            {
                MyWindow.Alert('投票失败失败，错误代码：' + msg.fail)
                return;
            }
            ActiveManager.getInstance().setLike(id,like)
            if(oo.like==1)
                this.cardLike[id].like_num ++;
            else
                this.cardLike[id].unlike_num ++;
            fun && fun();
            //this.getCardLike(id,fun)
        });
    }


}