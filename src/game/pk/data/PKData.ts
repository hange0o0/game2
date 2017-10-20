class PKData {

    public static ROTA_LEFT = 1
    public static ROTA_RIGHT = -1
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
    public team1:PKTeamData;
    public team2:PKTeamData;

    public monsterList = [];//场上的怪的数据
    public playerObj = {};//场上的玩家的数据
    constructor(){
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

    //开始游戏
    public start(){
        this.startTime = egret.getTimer()
        this.stopTime = 0;
        this.actionTime = 0;
        this.monsterID = 1;
        this.isGameOver = false;
    }





    public getTeamByID(teamID){
        return this.team1.id == teamID?this.team1:this.team2
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
        return monster;
    }

    //移除场上怪物
    public removeMonster(id){
        for(var i=0;i<this.monsterList.length;i++)
        {
            var oo = this.monsterList[i];
            if(oo.id == id)
            {
                this.monsterList.splice(i,1);
                return;
            }
        }
    }
}