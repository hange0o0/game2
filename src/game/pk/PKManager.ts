class PKManager {
    public static TYPE_HANG = 1;
    public static TYPE_TEST = 101;
    public static TYPE_MAIN_HANG = 102; //挂机动画用
    public static TYPE_SLAVE = 103;
    private static instance:PKManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKManager();
        return this.instance;
    }

    public pkType;

    public getPKBG(id){
        return Config.localResRoot + 'map/map'+(id || 1)+'.jpg';
    }

    public testFail(failID){
        switch(failID)
        {
            case 101:
                Alert('PK异常！MP数值不对！');
                return true;
            case 102:
                Alert('PK异常！使用了无效的卡牌！');
                return true;
        }
        return false;
    }

    public sendResult(fun){
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
        }
    }

    public startPK(pkType,data){
        this.pkType = pkType;
        var PD = PKData.getInstance();
        PD.init(data);
        PKingUI.getInstance().show();
    }

    public test(atk,def){
        var PD = PKData.getInstance()

        //攻击列表乱序
        var tempList = atk.list.concat();
        var atkList = [];
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
}