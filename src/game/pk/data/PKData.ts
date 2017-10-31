class PKData extends egret.EventDispatcher{
    private static instance:PKData;

    public static getInstance() {
        if (!this.instance) this.instance = new PKData();
        return this.instance;
    }

    public isGameOver = false //游戏结束
    public startTime = 0 //游戏开始时间
    public stopTime = 0 //游戏暂停时间
    public actionTime = 0 //游戏数据上处理过的时间

    public monsterID;//怪物ID下标累计
    public team1:PKTeamData;  //进攻方
    public team2:PKTeamData;
    public playerNum = 2;

    public monsterList = [];//场上的怪的数据
    public playerObj = {};//场上的玩家的数据
    public myPlayer:PKPlayerData;

    //public videoList = [] //所有要触发动画的集合
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
        this.actionTime = 0;
        this.monsterID = 1;
        this.isGameOver = false;
        //this.videoList.length = 0;
        //this.topVideoList.length = 0;

        this.team1 = new PKTeamData(data.team1)
        this.team2 = new PKTeamData(data.team2)
        this.team1.enemy = this.team2
        this.team2.enemy = this.team1

        this.playerObj = {};
        this.myPlayer = null;
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

        if(!this.myPlayer) //看别人的录像
        {
            this.team1.atkRota = PKConfig.ROTA_LEFT
            this.team2.atkRota = PKConfig.ROTA_RIGHT
        }

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
        return this.team1.id == teamID?this.team1:this.team2
    }
    public getTeamByRota(rota){
        return this.team1.atkRota == rota?this.team1:this.team2
    }

    public getPlayer(id):PKPlayerData{
        return this.playerObj[id]
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
        return monster;
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