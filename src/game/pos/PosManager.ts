class PosManager {
    private static _instance:PosManager;
    public static getInstance():PosManager {
        if (!this._instance)
            this._instance = new PosManager();
        return this._instance;
    }

    public maxNum = 5;
    public oneCardNum = 3;
    public defList
    public atkList

    public init(data){
          this.defList = data.def_list.list
          this.atkList = data.atk_list.list
    }

    //最大出战数量
    public maxPosNum(){
        return 19 + TecManager.getInstance().getLevel(4);
    }

    public getListByType(type){
        if(type == 'atk')
            return this.atkList;
        else
            return this.defList;
    }

    public getDataByID(type,id){
        var list = this.getListByType(type);
        for(var i=0;i<list.length;i++)
        {
            if(list[i].id == id)
                return list[i]
        }
        return null;
    }

    //取开放的防御阵
    public getOpenDef(){
        var list = this.getListByType('def');
        var arr = []
        for(var i=0;i<list.length;i++)
        {
            if(!list[i].close)
                arr.push(list[i]);
        }
        return arr;
    }


    public addPos(type,name,list,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.name = name;
        oo.list = list;
        Net.addUser(oo);
        Net.send(GameEvent.pos.add_pos,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('最多只能有5个')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('传入卡牌非法')
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('每个卡牌最多只能上阵3个')
                return;
            }
            if(msg.fail == 4)
            {
                MyWindow.Alert('手牌上限非法')
                return;
            }
            self.getListByType(type).push({
                id:msg.id,
                name:Base64.encode(name),
                list:list
            })
            EM.dispatch(GameEvent.client.pos_change)
            if(fun)
                fun();
        });
    }

    public changePos(type,id,name,list,fun?){
        var self = this;
        var oo:any = {};
        var posData = self.getDataByID(type,id);
        oo.type = type;
        oo.id = id;
        if(name && posData.name != Base64.encode(name))
            oo.name = name;
        if(list && posData.list != list)
            oo.list = list;
        if(!oo.name && !oo.list)
        {
            fun && fun();
            return;
        }
        Net.addUser(oo);
        Net.send(GameEvent.pos.change_pos,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            if(msg.fail == 2)
            {
                MyWindow.Alert('传入卡牌非法')
                return;
            }
            if(msg.fail == 3)
            {
                MyWindow.Alert('每个卡牌最多只能上阵3个')
                return;
            }
            if(name)
                posData.name = Base64.encode(name)
            if(list)
                posData.list = list

            EM.dispatch(GameEvent.client.pos_change)
            if(fun)
                fun();
        });
    }

    public changeClose(type,id,fun?){
        var self = this;
        var oo:any = {};
        var posData = self.getDataByID(type,id);
        oo.type = type;
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pos.change_close,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            posData.close = !posData.close;
            if(fun)
                fun();
        });
    }

    public deletePos(type,id,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.id = id;
        Net.addUser(oo);
        Net.send(GameEvent.pos.delete_pos,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            var list = self.getListByType(type);
            for(var i=0;i<list.length;i++)
            {
                if(list[i].id == id)
                {
                    list.splice(i,1);
                    break;
                }
            }
            EM.dispatchEventWith(GameEvent.client.pos_change)
            if(fun)
                fun();
        });
    }
}