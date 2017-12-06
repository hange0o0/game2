class PKManager {
    public static TYPE_HANG = 1;
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
        }
    }

    public startPK(pkType,data){
        this.pkType = pkType;
        var PD = PKData.getInstance();
        PD.init(data);
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