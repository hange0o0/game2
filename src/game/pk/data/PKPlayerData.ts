//玩家数据
class PKPlayerData {
    public id;//唯一ID
    public teamData:PKTeamData   //对应队伍

    public handCard = [];//当前的手牌  ｛index,id｝
    public posCard = {};//上阵的手牌 1-4

    private mp//当前的魔法
    private lastTime//上一次魔法处理时间




    constructor(obj?){
        if(obj)
            this.fill(obj);
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }
    }

    public addMP(v){
        this.resetMp();
        this.mp += v;
    }
    public getMP(v){
        this.resetMp();
        return this.mp;
    }

    private resetMp(){
        var t = PKData.getInstance().getPassTime();
        var step = 1;
        var max = 20;

        if(this.mp >= max){
            this.lastTime = t;
            return;
        }

        var nextCD = this.getNextCD();
        while (nextCD <= t) {
            this.mp += step;

            if(this.mp >= max){
                this.lastTime = t;
                return;
            }

            this.lastTime = nextCD
            nextCD = this.getNextCD();
        }
    }

    private getNextCD(){
        if(this.lastTime < 1000 * 60)
            return this.lastTime + 3000;
        else if(this.lastTime < 1000 * 60 * 2)
            return this.lastTime + 2000;
        else
            return this.lastTime + 1000;
    }

    //取手牌  (5)
    public getHandCard(){
        return this.handCard.slice(0,5);
    }

    //取可上战场的怪
    public getAddMonster(t){
        var arr = [];
        for(var s in this.posCard)
        {
            var oo:PKPosCardData = this.posCard[s];
            if(!oo)continue;

            if(oo.testAdd(t))
            {
                arr.push(oo)
            }
        }
        if(arr.length > 1)
        {
            ArrayUtil.sortByField(arr,['actionTime','id'],[0,0])
        }
        return arr;
    }

    //取可起作用的技能
    public getAddSkill(){
        return [];
    }
}