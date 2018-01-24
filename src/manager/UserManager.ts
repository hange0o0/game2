class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public gameid: string = 'test';
    public landid: string;

    public hourcoin: number;
    public nick: string;
    public type: number;

    public diamond: number;
    public uid: number;
    public level: number;
    public opentime: number;
    public tec_force:number;
    public last_land: number;

    public energy: any;
    public openData: any;
    public coin: any;


    public maxEnergy = 60;
    public maxLevel = 50;


    public fill(data:any):void{
        this.gameid = data.gameid;
        this.landid = data.land_key;
        this.nick = data.nick;
        this.uid = data.uid;
        this.type = data.type;
        this.hourcoin = data.hourcoin;
        this.coin = data.coin;
        this.opentime = data.opentime;
        this.level = data.level;
        this.tec_force = data.tec_force;
        this.last_land = data.last_land;
        this.diamond = data.diamond;
        this.energy = data.energy; //  '{"v":0,"t":0,"rmb":0}'
        this.openData = data.openData; //  '{"v":0,"t":0,"rmb":0}'



        CardManager.getInstance().init(data.card)
        PosManager.getInstance().init(data)
        HangManager.getInstance().init(data.hang)
        ActiveManager.getInstance().init(data.active)
        TecManager.getInstance().init(data.tec)
        PropManager.getInstance().init(data.prop)
    }

    public getCoin(){
        var time = TM.now();

        //生产影响
        var cd = 60;
        var step = Math.round(this.hourcoin/60);
        var add = Math.floor((time - this.coin.t)/cd);
        if(add > 0)
        {
            this.coin.v += add*step;
            this.coin.t = this.coin.t + add*cd;
        }

        //主人影响
        var masterTime = SlaveManager.getInstance().getMasterTime();
        if(masterTime)
        {
            if(this.coin.st < masterTime)
                this.coin.st += masterTime;
            var num = Math.floor((time - this.coin.st)/3600)//每小时结算一次
            if(num)
            {
                this.coin.st += num*3600;
                this.coin.v -= num*Math.floor(this.hourcoin*0.2);
            }
        }

        return this.coin.v;
    }


    public getEnergy(){
        var v = this.getEnergyStep();
        var t = TM.now();
        var add =   Math.floor((t - this.energy.t)/v)
        if(add > 0)
        {
            this.energy.v = Math.min(this.maxEnergy,this.energy.v + add);
            this.energy.t = this.energy.t + add*v;
            EM.dispatchEventWith(GameEvent.client.energy_change)
        }
        return this.energy.v;
    }

    public getEnergyStep(){
        return 30*60;
    }

    public getNextEnergyCD(){
        var v = this.getEnergyStep();
        this.getEnergy();
        //if(this.energy.t == TM.now())
        //    return 0;
        return  this.energy.t + v -  TM.now();
    }



    public testDiamond(v){
        if(UM.diamond < v)
        {
            Confirm('钻石不足！\n需要：' +v+'\n当前：'+UM.diamond + '\n是否前往购买钻石？',function(v){
                if(v == 1)
                {
                    //ShopUI.getInstance().show('diamond');
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }
    public testCoin(v){
        var coin = UM.getCoin()
        if(coin < v)
        {
            Confirm('金币不足！\n需要：' +v+'\n当前：'+coin + '\n是否前往购买金币？',function(v){
                if(v == 1)
                {
                    //ShopUI.getInstance().show('coin');
                }
            },['取消','购买'])
            return false;
        }
        return true;
    }

    public testEnergy(v){
        if(UM.getEnergy() < v)
        {
            Confirm('体力不足！\n需要：' +v+'\n当前：'+UM.getEnergy() + '\n是否前往购买体力？',function(v){
                if(v == 1)
                {
                    //ShopUI.getInstance().show('energy');
                }
            },['取消','购买'])
            return false;
        }
        return true;

    }
}
                                