//玩家数据
class PKPlayerData {
    public id;//唯一ID
    public openid;
    public force;//怪的基础属性
    public teamData:PKTeamData   //对应队伍

    private handCard = {};//当前的手牌  [{index,mid},]  上限5
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
        this.handCard = {};
        this.hideCard = [];
        if(obj['autolist'])
            this.autoList = PKTool.decodeAutoList(obj['autolist'].split(','))
        if(obj['card'])
        {
            for(var i=0;i<obj['card'].length;i++)
            {
                var cardData:any = {
                    index:i,
                    cardPos:0,
                    mid:obj['card'][i]
                }
                if(i<PKConfig.maxHandCard)
                {
                    cardData.cardPos =  i+1;
                    this.handCard[cardData.cardPos] = cardData;
                }
                else
                {
                    this.hideCard.push(cardData)
                }
            }
        }
        this.mp = PKConfig.mpInit;
    }

    public addMP(v){
        this.resetMp();
        this.mp += v;
    }
    public getMP(){
        this.resetMp();
        return this.mp;
    }

    private resetMp(){
        var t = PKData.getInstance().actionTime;
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

    public nextMpRate(){
        return  (PKData.getInstance().actionTime - this.lastTime) / (this.getNextCD() - this.lastTime)
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
        if(this.posCard[pos])
        {
            this.teamData.removeState(this.posCard[pos])
        }
        this.posCard[pos] =  new PKPosCardData({
            id:pos,
            mid:cardData.mid,
            owner:this.id,
        })

        for(var i=1;i<=PKConfig.maxHandCard;i++)
        {
             if(this.handCard[i] == cardData)
             {
                 var newCard:any = this.hideCard.shift();
                 if(newCard)
                 {
                     newCard.cardPos = i
                 }
                 this.handCard[i] = newCard;
                 break;
             }
        }

        if(cardData.mid < 100)
            this.addMP(-MonsterVO.getObject(cardData.mid).cost)
        else
            this.addMP(-SkillVO.getObject(cardData.mid).cost)
    }

    //取手牌  (5)
    public getHandCard(){
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
                data.isAuto = true;
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
            if(!oo || oo.mid>100)continue;

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
    public getAddSkill(t){
        var arr = [];
        for(var s in this.posCard)
        {
            var oo:PKPosCardData = this.posCard[s];
            if(!oo || oo.mid<100)continue;

            if(oo.testAdd(t) && SBase.getData(oo.mid).useAble(oo))
            {
                arr.push(oo)
            }
        }
        return arr;
    }
}