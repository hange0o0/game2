//玩家数据
class PKPlayerData {
    public id;//唯一ID
    public gameid;
    public nick;
    public head;
    public hp; //城堡的血量
    public type//类型
    public force;//怪的基础属性
    public teamData:PKTeamData   //对应队伍

    public card//原始的手牌
    private handCard = {};//当前的手牌  [{index,mid},]  上限5
    public hideCard = [];//隐藏的手牌  [{index,mid},]
    public posCard = {};//已上阵的手牌 1-4,如果是自动的，不受此限制
    private posIndex = 1;
    //public prePosCard = {};//准备上阵的手牌 1-4,如果是自动的，不受此限制

    public posHistory = []; //要发给服务器的出卡记录
    public useCardList = []//使用过的卡

    private mp = 0//当前的魔法
    public useMP = 0//已使用的魔法
    private lastTime = 0//上一次魔法处理时间


    public autoList;
    public skillValue = {};


    constructor(obj?){
        if(obj)
            this.fill(obj);

        if(this.nick)
            this.nick = Base64.decode(this.nick);
        else
            this.nick = '守卫者' + this.id;
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }
        this.handCard = {};
        this.hideCard = [];
        this.autoList = null;
        if(obj['autolist'])
            this.autoList = PKTool.decodeAutoList(obj['autolist'].split(','))
        if(obj['actionlist'])
            this.autoList = PKTool.decodeActionList(obj['actionlist'].split(','))
        if(obj['card'])
        {
            var card = obj['card'].split(',');
            for(var i=0;i<card.length;i++)
            {
                var cardData:any = {
                    index:i,
                    cardPos:0,
                    mid:card[i]
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
        this.posIndex = 1;
    }

    public getCardNum(){
        return (ObjectUtil.objLength(this.getHandCard(),true) + this.hideCard.length + (this.autoList?this.autoList.length:0))
    }
    public getPosNum(){
        return ObjectUtil.objLength(this.posCard,true)
    }

    public addMP(v){
        this.resetMp();
        this.mp += v;
        this.useMP -= v;
    }
    public getMP(){
        this.resetMp();
        return this.mp;
    }

    private resetMp(){
        var t = PKData.getInstance().actionTime;
        var step = 1;
        //var max = PKConfig.maxMP;
        //
        //if(this.mp >= max){
        //    this.lastTime = t;
        //    return;
        //}

        var nextCD = this.getNextCD();
        while (nextCD <= t) {
            this.mp += step;

            //if(this.mp >= max){
            //    this.lastTime = t;
            //    return;
            //}

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

    public addPosCard(cardData){
        var posCard = this.posCard[this.posIndex] =  new PKPosCardData({
            id:this.posIndex,
            mid:cardData.mid,
            cardData:cardData,
            owner:this.id,
            actionTime:PKData.getInstance().actionTime,
        })
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_POS_ADD,
            user:this.posCard[this.posIndex],
        })

        this.posIndex ++
        this.addMP(-CM.getCardVO(cardData.mid).cost)

        this.sendToServer(posCard)
    }

    public onPosCardEnable(posCard:PKPosCardData){
        for(var i=1;i<=PKConfig.maxHandCard;i++)
        {
            if(this.handCard[i] == posCard.cardData)
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

        var step = Math.floor(posCard.addTime/PKConfig.stepCD)
        this.posHistory.push(step + '#' + posCard.cardData.mid);
        this.useCardList.push(posCard.cardData.mid)
        if(newCard)
        {
            newCard.showTime = posCard.addTime + 500;
        }
    }

    private sendToServer(posCard:PKPosCardData){
        var PD = PKData.getInstance();
        if(this == PD.myPlayer && !PD.isReplay && PD.sendCard) //需要通知服务器，等服务器返回成功才应答
        {
            PKManager.getInstance().sendPosToServer(posCard)
        }
        else
        {
            posCard.enableWaiting();
        }

    }

    ////上阵卡
    //public testAddPosCard(t){
    //    for(var s in this.prePosCard)
    //    {
    //        if(this.prePosCard[s] && this.prePosCard[s].testAdd(t))
    //        {
    //            if(this.posCard[s])
    //            {
    //                this.posCard[s].die();
    //            }
    //            this.posCard[s] = this.prePosCard[s];
    //            this.prePosCard[s] = null;
    //        }
    //    }
    //}

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
                data.actionTime = PKData.getInstance().actionTime;
                data.isAuto = true;
                this.posCard[data.id] = new PKPosCardData(data);
                this.autoList.shift();

                this.addMP(-CM.getCardVO(data.mid).cost)
                if(this == PKData.getInstance().myPlayer)
                {
                    PKData.getInstance().addVideo({
                        type:PKConfig.VIDEO_POS_ADD,
                        user:this.posCard[data.id],
                    })
                }
                var step = Math.floor(PKData.getInstance().actionTime/PKConfig.stepCD)
                this.posHistory.push(step + '#' + data.mid);
                this.useCardList.push(data.mid)
            }
            else
                break;
        }
    }

    public getEnablePos(t,leftSpace){
        var arr = [];

        var monsterNum = 0;
        for(var s in this.posCard)
        {
            var oo:PKPosCardData = this.posCard[s];
            if(!oo)continue;

            if(oo.testAdd(t))
            {
                if(oo.mid < PKConfig.skillBeginID)
                {
                    if(leftSpace == 0)
                        continue;
                    else
                        monsterNum ++;
                }
                arr.push(oo)
            }
            else if(!oo.useEnable())//已失效
            {
                this.posCard[s].die();
                PKData.getInstance().addVideo({
                    type:PKConfig.VIDEO_POS_REMOVE,
                    user:this.posCard[s],
                })
                this.posCard[s] = null;
            }
        }
        if(monsterNum > 1)
        {
            ArrayUtil.sortByField(arr,['actionTime','id'],[0,0])
        }
        return arr;
    }

    //取可上战场的怪
    //public getAddMonster(t){
    //    var arr = [];
    //
    //    for(var s in this.posCard)
    //    {
    //        var oo:PKPosCardData = this.posCard[s];
    //        if(!oo || oo.mid>100)continue;
    //
    //        if(oo.testAdd(t))
    //        {
    //            arr.push(oo)
    //        }
    //    }
    //    if(arr.length > 1)
    //    {
    //        ArrayUtil.sortByField(arr,['actionTime','id'],[0,0])
    //    }
    //    return arr;
    //}

    ////取可起作用的技能
    //public getAddSkill(t){
    //    var arr = [];
    //    for(var s in this.posCard)
    //    {
    //        var oo:PKPosCardData = this.posCard[s];
    //        if(!oo || oo.mid<100)continue;
    //
    //        if(oo.testAdd(t))
    //        {
    //            arr.push(oo)
    //        }
    //    }
    //    return arr;
    //}
}