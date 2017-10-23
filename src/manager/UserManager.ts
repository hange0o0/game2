class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public openid: string = 'test';
    public landid: string;

    public word: string;
    public nick: string;
    public head: string;
    public coin: number;
    public exp: number;
    public uid: number;
    public next_exp: number;
    public level: number;
    public opentime: number;
    public tec_force:number;
    public award_force:number;
    public last_land: number;
    public diamond: any;
    public tec: any;
    public server_game: any;
    public server_game_equal: any;
    public main_game: any;
    public day_game: any;
    public honor: any;
    public active: any;
    public prop: any;
    public collect: any;
    public friends: any;
    public energy: any;
    public pk_common: any;


    public friendtime: number;   //登录时，好友最新消息的时间点
    public maxEnergy = 60;
    public maxLevel = 50;


    public fill(data:any):void{
        this.openid = data.openid;
        this.landid = data.land_key;
        this.nick = data.nick;
        this.uid = data.uid;
        this.word = data.word;
        this.head = data.head;
        this.coin = data.coin;
        this.exp = data.exp;
        this.opentime = data.opentime;
        this.next_exp = data.next_exp;
        this.level = data.level;
        this.tec_force = data.tec_force;
        this.award_force = data.award_force;
        this.last_land = data.last_land;
        this.diamond = data.diamond;//'{"free":0,"rmb":0}'
        this.tec = data.tec;    //'{"main":{},"ring":{},"monster":{}}')
        this.server_game = data.server_game; //{"choose":null,"enemy":null,"exp":0,"win":0,"total":0,"last":0,"time":0,"pkdata":null,"pk":0}
        this.server_game_equal = data.server_game_equal; //{"choose":null,"enemy":null,"exp":0,"win":0,"total":0,"last":0,"max":0,"time":0,"pkdata":null,"pk":0}
        this.main_game = data.main_game;  //'{"choose":null,"level":1,"kill":[],"awardtime":0,"time":0,"pkdata":null}'
        this.day_game = data.day_game;  //'{"level":0,"free":0,"lasttime":0,"rmb":0,"times":0,"pkdata":null}');
        this.honor = data.honor;  //'{"monster":{},"ring":{},"task":{}}');
        this.prop = data.prop; //{id:{num}}
        this.collect = data.collect;     //'{"level":{},"num":{}}')
        this.friends = data.friends; //'{"v":0,"t":0,"tk":0}');//好友相关 每人每天只可发送20条消息
        this.energy = data.energy; //  '{"v":0,"t":0,"rmb":0}'
        this.active = data.active; //  '{task:{}}'
        this.pk_common = data.pk_common; //  '{history:{}}'




        if(!UM.tec.leader)
            UM.tec.leader = {};
        if(!UM.tec.skill)
            UM.tec.skill = [];
        if(!UM.tec.copy_skill)
            UM.tec.copy_skill = {};
        if(!UM.main_game.hlevel)
            UM.main_game.hlevel = 0;

        this.initActive();
         //DayGameManager.getInstance().resetDay();

        this.friendtime = data.friendtime || 1;
        if(TM.now() - this.friendtime > 3600*24*3)
            this.friendtime = 1;

        Config.pk_version = Math.floor(data.pk_version);
    }

    public initActive(){
        if(!this.active)
            this.active = {};

        if(!UM.active.guess)
            UM.active.guess = {num:0,total:0,win:0,lasttime:0};

        if(this.active.team_pve)
        {
            if(!DateUtil.isSameDay(this.active.team_pve.lasttime))
            {
                if(DateUtil.isSameDay(this.active.team_pve.lasttime+3600*24))//昨天
                {
                    this.active.team_pve.yteam = this.active.team_pve.team;
                }
                this.active.team_pve.team = 0
                this.active.team_pve.lasttime = TM.now();
            }
        }
        else
            this.active.team_pve = {award:[]};


    }

    public getDiamond(rmb=false){
        if(rmb)
            return this.diamond.rmb;
        return this.diamond.free + this.diamond.rmb;
    }

    public addDiamond(value){
        this.diamond.rmb += value;
        EM.dispatch(GameEvent.client.diamond_change)
    }

    public getForce(){
        return this.tec_force + this.award_force;
    }

    public isVip(id){
        return this.tec.vip.indexOf(id) != -1
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
        if(this.isVip(201))
            return 24*60;
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
        if(UM.getDiamond() < v)
        {
            Confirm('钻石不足！\n需要：' +v+'\n当前：'+UM.getDiamond() + '\n是否前往购买钻石？',function(v){
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
        if(UM.coin < v)
        {
            Confirm('金币不足！\n需要：' +v+'\n当前：'+UM.coin + '\n是否前往购买金币？',function(v){
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
                                