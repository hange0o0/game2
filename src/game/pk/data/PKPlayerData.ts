//玩家数据
class PKPlayerData {
    public id;//唯一ID
    public openid;
    public base;//怪的基础属性
    public teamData:PKTeamData   //对应队伍

    private handCard = [];//当前的手牌  [{index,mid},]  上限5
    private hideCard = [];//隐藏的手牌  [{index,mid},]
    public posCard = {};//上阵的手牌 1-4,如果是自动的，不受此限制

    private mp = 0//当前的魔法
    private lastTime = 0//上一次魔法处理时间


    public autoList;

    constructor(obj?){
        if(obj)
            this.fill(obj);
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }

        if(obj['autolist'])
            this.autoList = PKTool.decodeAutoList(obj['autolist'].split(','))
        if(obj['card'])
        {
            this.handCard = [];
            this.hideCard = [];
            for(var i=0;i<obj['card'].length;i++)
            {
                  this.hideCard.push({
                      index:i,
                      mid:obj['card'][i]
                  })
            }
        }
        this.mp = PKConfig.mpInit;
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
        var max = PKConfig.maxMP;

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
            return this.lastTime + 2000;
        else if(this.lastTime < 1000 * 60 * 2)
            return this.lastTime + 1500;
        else
            return this.lastTime + 1000;
    }

    //上阵卡
    public addPosCard(pos,cardData){
        this.posCard[pos] =  new PKPosCardData({
            id:pos,
            mid:cardData.mid,
            owner:this.id,
        })
        var index = this.handCard.indexOf(cardData);
        this.handCard.splice(index,1)
    }

    //取手牌  (5)
    public getHandCard(){
        while(this.handCard.length < PKConfig.maxHandCard && this.hideCard.length > 0)
        {
            this.handCard.push(this.hideCard.shift())
        }
        return this.handCard;
    }

    //自动上阵相关
    public autoAction(t){
        while(this.autoList && this.autoList[0])
        {
            var data = this.autoList[0];
            if(data.time <= t)
            {
                data.owner = this.id;
                this.posCard[data.id] = new PKPosCardData(data);
                this.autoList.shift();
            }
            else
                break;
        }
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
        var arr = [];
        for(var s in this.posCard)
        {
            var oo:PKPosCardData = this.posCard[s];
            if(!oo)continue;

            //if(oo.testAdd(t))
            //{
            //    arr.push(oo)
            //}
        }
        return arr;
    }
}