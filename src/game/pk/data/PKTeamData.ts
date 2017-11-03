//队伍数据
class PKTeamData {
    public id = 1   //1 or 2
    public atkRota = 0  //进攻方向  0左路出发，1右路出发
    public enemy:PKTeamData

    public hp  = 0 //城堡的血
    public maxhp  = 0

    public members = [];
    public stateObj = {};
    constructor(obj?){
        if(obj)
            this.fill(obj);
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }
        this.maxhp = this.hp
    }

    //监听状态
    public addStateLister(state,posCard:PKPosCardData){
        if(!this.stateObj[state])
            this.stateObj[state] = [];
        this.stateObj[state].push(posCard)
        console.log('add')
    }
    //
    public testState(state,target:PKMonsterData){
        if(!this.stateObj[state] || this.stateObj[state].length == 0)
            return
        for(var i=0;i<this.stateObj[state].length;i++)
        {
            var posCard:PKPosCardData = this.stateObj[state][i];
            SBase.getData(posCard.mid).effectTarget(posCard,target);
        }
    }

    //不带参数表现清除过期的
    public removeState(posCard?:PKPosCardData){
        if(posCard)
        {
            if(posCard.mid < 100)
                return;
            var state = SkillVO.getObject(posCard.mid).state;
            if(!state || !this.stateObj[state] || this.stateObj[state].length == 0)
                return
            ArrayUtil.removeItem(this.stateObj[state],posCard);
            return;
        }
        for(var s in this.stateObj)
        {
            var arr = this.stateObj[s];
            for(var i=0;i<arr.length;i++)
            {
                var posCard:PKPosCardData = arr[i];
                if(!posCard.useEnable())
                {
                    arr.splice(i,1);
                    i--;
                    console.log('remove')
                }
            }
        }

    }

}