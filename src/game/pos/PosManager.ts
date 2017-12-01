class PosManager {
    private static _instance:PosManager;
    public static getInstance():PosManager {
        if (!this._instance)
            this._instance = new PosManager();
        return this._instance;
    }

    public maxNum = 5;
    public defList
    public atkList

    public init(data){
          this.defList = data.def_list.list
          this.atkList = data.atk_list.list
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
                Alert('最多只能有5个')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('传入卡牌非法')
                return;
            }
            if(msg.fail == 3)
            {
                Alert('每个卡牌最多只能上阵3个')
                return;
            }
            self.getListByType(type).push({
                id:msg.id,
                name:name,
                list:list
            })
            if(fun)
                fun();
        });
    }

    public changePos(type,id,name,list,close,fun?){
        var self = this;
        var oo:any = {};
        var posData = self.getDataByID(type,id);
        oo.type = type;
        oo.id = id;
        if(name && posData.name != name)
            oo.name = name;
        if(list && posData.list != list)
            oo.list = list;
        oo.close = close;
        Net.addUser(oo);
        Net.send(GameEvent.pos.change_pos,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                Alert('找不到指定阵法')
                return;
            }
            if(msg.fail == 2)
            {
                Alert('传入卡牌非法')
                return;
            }
            if(msg.fail == 3)
            {
                Alert('每个卡牌最多只能上阵3个')
                return;
            }
            if(name)
                posData.name = name
            if(list)
                posData.list = list
            posData.close = close

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
                Alert('找不到指定阵法')
                return;
            }
            var list = this.getListByType(type);
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