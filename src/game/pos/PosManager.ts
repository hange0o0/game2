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
        //for(var i=0;i<list.length;i++)
        //{
        //    if(list[i].id == id)
        //        return list[i]
        //}
        return list[id];
    }

    //取开放的防御阵
    public getOpenDef(){
        var list = this.getListByType('def');
        var arr = []
        for(var s in list)
        {
            if(!list[s].close)
                arr.push(list[s]);
        }
        return arr;
    }


    public addPos(type,id,list,name,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.list = list;
        oo.name = name;
        oo.id = id;
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
            self.getListByType(type)[id] = ({
                id:id,
                list:list
            })
            if(name)
                self.getListByType(type)[id].name = Base64.encode(name);
            EM.dispatch(GameEvent.client.pos_change)
            if(fun)
                fun();
        });
    }

    public changePos(type,id,list,fun?){
        var self = this;
        var oo:any = {};
        var posData = self.getDataByID(type,id);
        oo.type = type;
        oo.id = id;
        oo.lv = TecManager.getInstance().getLevel(4);
        if(list && posData.list != list)
            oo.list = list;
        if(!oo.list)
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
    public changeName(type,id,name,fun?){
        var self = this;
        var oo:any = {};
        oo.type = type;
        oo.name = name;
        oo.id = id;
        var posData = self.getDataByID(type,id);
        Net.addUser(oo);
        Net.send(GameEvent.pos.change_name,oo,function(data){
            var msg = data.msg;
            if(msg.fail == 1)
            {
                MyWindow.Alert('找不到指定阵法')
                return;
            }
            posData.name = Base64.encode(name);
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
            delete list[id];
            EM.dispatchEventWith(GameEvent.client.pos_change)
            if(fun)
                fun();
        });
    }
}