//出战区的怪
class PKPosCardData {
    public id;//唯一ID 1-4
    public mid //对应的怪
    public actionTime//上次行动的时间
    public actionResult//是否有等待出手的怪

    public num//已使用的次数

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

    //是否可上场
    public testAdd(t){
        if(this.actionResult)
            return true;
        if(t - this.actionTime > 1000*3)
        {
            this.actionTime = t;
            this.actionResult = 1;
        }
        return false;
    }

    //组装上阵怪的数据
    public getMonster(){
        return {

        }
    }
    //组装上阵怪的数据
    public setHaveAdd(actionTime){
        this.actionTime = actionTime;
        this.actionResult = 0;
    }
}