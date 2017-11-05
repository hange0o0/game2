class PKData extends egret.EventDispatcher{
    private static instance:PKData;

    public static getInstance() {
        if (!this.instance) this.instance = new PKData();
        return this.instance;
    }

    public jumpMV = false;
    public isGameOver = false //游戏结束
    public startTime = 0 //游戏开始时间
    public stopTime = 0 //游戏暂停时间
    public actionTime = 0 //游戏数据上处理过的时间

    public monsterID;//怪物ID下标累计
    public team1:PKTeamData;  //进攻方
    public team2:PKTeamData;
    public sysTeam:PKTeamData;
    public playerNum = 2;

    public monsterChange = false//怪有变化
    public randomSeed = 0//随机的种子
    public monsterList = [];//场上的怪的数据
    public playerObj = {};//场上的玩家的数据
    public myPlayer:PKPlayerData;
    public sysPlayer:PKPlayerData;
    public diamondData;

    //public stateObj = [] //所有要触发动画的集合
    //public topVideoList = [] //影响关部的动画的集合
    //private topKey = ['monster_win','monster_add'];
    constructor(){
        super();
    }

    //取经过的时间
    public getPassTime(){
        return egret.getTimer() - this.startTime;
    }

    //暂停
    public stop(isLase?){
        if(isLase)//在最后一次行动是暂停
            this.stopTime = this.actionTime + 1;
        else
            this.stopTime = egret.getTimer();
    }

    //继续
    public play(){
        this.startTime += egret.getTimer() - this.stopTime;
        this.stopTime = 0;
    }

    //初始化游戏
    public init(data){
        this.monsterList.length = 0;
        this.playerObj = {};
        this.myPlayer = null;
        this.actionTime = 0;
        this.monsterID = 1;
        this.isGameOver = false;
        this.monsterChange = false;


        this.randomSeed = data.seed;
        this.team1 = new PKTeamData(data.team1)
        this.team2 = new PKTeamData(data.team2)
        this.team1.enemy = this.team2
        this.team2.enemy = this.team1
        for(var i=0;i<data.players.length;i++)
        {
            var player = new PKPlayerData(data.players[i])
            player.teamData = this.getTeamByID(data.players[i].team)
            this.playerObj[player.id] = player;
            if(player.openid == UM.openid)
            {
                this.myPlayer = player;
                player.teamData.atkRota = PKConfig.ROTA_LEFT
                player.teamData.enemy.atkRota = PKConfig.ROTA_RIGHT
                player.teamData.members.unshift(player);
            }
            else
                player.teamData.members.push(player);
        }

        this.sysTeam = new PKTeamData({id:'sys'})
        this.sysPlayer = new PKPlayerData({id:'sys',openid:'sys',team:'sys'})
        this.sysPlayer.teamData = this.sysTeam;
        this.playerObj[this.sysPlayer.id] = this.sysPlayer;

        if(!this.myPlayer) //看别人的录像
        {
            this.team1.atkRota = PKConfig.ROTA_LEFT
            this.team2.atkRota = PKConfig.ROTA_RIGHT
        }
        this.team1.reInit();
        this.team2.reInit();
    }

    public random(){
        var seed = this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        this.randomSeed = rd * 100000000;
        return rd;
    }

    //数据乱序
    public upsetArr(arr){
        var self = this;
        arr.sort(rdFun);
        function rdFun(){
            return self.random()>0.5?-1:1;
        }
    }

    public randomOne(arr:Array<any>,splice = false):any{
        var index = Math.floor(arr.length * this.random())
        var data = arr[index];
        if(splice)
            arr.splice(index,1);
        return data;
    }

    //开始游戏
    public start(){
        this.startTime = egret.getTimer()
        this.stopTime = 0;
    }




    public addVideo(data){
        this.dispatchEventWith('video',false,data)
        //this.videoList.push(data)
        //if(this.topKey.indexOf(data.type) != -1)
        //    this.topVideoList.push(data);
    }

    public getTeamByID(teamID){
        if(teamID == 'sys')
            return this.sysTeam;
        return this.team1.id == teamID?this.team1:this.team2
    }
    public getTeamByRota(rota){
        return this.team1.atkRota == rota?this.team1:this.team2
    }

    public getPlayer(id):PKPlayerData{
        return this.playerObj[id]
    }

    public isWin(){
        return this.myPlayer.teamData.hp > 0 &&  this.myPlayer.teamData.enemy.hp <= 0;
    }

    //找玩家对应的怪
    public getMonsterByPlayer(playerid){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.owner == playerid)
             {
                 arr.push(oo)
             }
        }
        return arr;
    }
    //找玩家对应的怪
    public getMonsterByTeam(team){
        var arr = [];
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
             if(oo.atkRota == team.atkRota)
             {
                 arr.push(oo)
             }
        }
        return arr;
    }

    //加入怪到场上
    public addMonster(data){
        var monster = new PKMonsterData(data)
        monster.id = this.monsterID;
        this.monsterID ++;
        this.monsterList.push(monster);

        this.addVideo({
            type:PKConfig.VIDEO_MONSTER_ADD,
            user:monster
        })

        monster.getOwner().teamData.testState('create',monster);
        this.monsterChange = true;
        return monster;
    }

    //重置战场上的怪的数据
    public resetMonsterData(){
        if(!this.monsterChange)
            return;
        this.monsterChange = true;
        for(var i=0;i<this.monsterList.length;i++)
        {

        }
    }

    //移除场上怪物
    //public removeMonster(id){
    //    for(var i=0;i<this.monsterList.length;i++)
    //    {
    //        var oo = this.monsterList[i];
    //        if(oo.id == id)
    //        {
    //            this.monsterList.splice(i,1);
    //            return;
    //        }
    //    }
    //}
}