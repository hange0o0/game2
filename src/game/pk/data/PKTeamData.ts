//队伍数据
class PKTeamData {
    public id = 1   //1 or 2
    public atkRota = 0  //进攻方向  0左路出发，1右路出发
    public enemy:PKTeamData

    public hp  = 0 //城堡的血
    public maxhp  = 0


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


    public getVO(){
        return null;
    }
}