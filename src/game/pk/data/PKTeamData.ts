//队伍数据
class PKTeamData {
    public id  //1 or 2  or sys
    public atkRota = 0  //进攻方向  0左路出发，1右路出发
    public enemy:PKTeamData


    public hp  = 0 //城堡的血
    public def  = 0

    public members = [];
    public stateObj = {};  //监听队伍中的状态，触发
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

    public reInit(){

    }

    //监听状态
    public addStateLister(listener:PKStateListener){
        if(!this.stateObj[listener.type])
            this.stateObj[listener.type] = [];
        this.stateObj[listener.type].push(listener)
        //console.log('add')
    }
    //
    public testState(state,target:PKMonsterData){
        if(!this.stateObj[state] || this.stateObj[state].length == 0)
            return
        for(var i=0;i<this.stateObj[state].length;i++)
        {
            var listener:PKStateListener = this.stateObj[state][i];
            listener.actionFun(target)
        }
    }

    //
    public removeStateListener(listener:PKStateListener){
        var state = listener.type
        if(!state || !this.stateObj[state] || this.stateObj[state].length == 0)
            return
        ArrayUtil.removeItem(this.stateObj[state],listener);
        listener.onRemove()
    }
    //
    public removeStateListerByOwner(owner){
        for(var state in this.stateObj)
        {
            for(var i=0;i<this.stateObj[state].length;i++)
            {
                var listener:PKStateListener = this.stateObj[state][i];
                if(listener.owner == owner)
                {
                    this.stateObj[state].splice(i,1);
                    i--;
                    listener.onRemove()
                }
            }
        }

    }

}