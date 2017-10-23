//出战区的怪
class PKPosCardData {
    public id;//唯一ID 1-4
    public mid //对应的怪
    public owner//主人ID

    public actionTime = 0//上次行动的时间
    public actionResult = 0//是否有等待出手的怪


    public num = 0//已使用的次数

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

    public useEnable(){
        return this.num < 3;
    }

    //是否可上场
    public testAdd(t){
        if(this.actionResult)
            return true;
        if(!this.useEnable())
        {
            return false;
        }
        if(t - this.actionTime > 1000*3)
        {
            this.actionTime = t;
            this.actionResult = 1;
        }
        return false;
    }

    //组装上阵怪的数据
    public getMonster(actionTime){
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(this.owner);
        var atkRota = owner.teamData.atkRota;
        var base = owner.base[this.mid];
        var x = atkRota == PKData.ROTA_LEFT ? 0:PKCode.getInstance().floorWidth;
        return {
            hp:base.hp,
            atk:base.atk,
            speed:base.speed,
            mid:this.mid,
            owner:this.owner,
            atkRota:atkRota,
            x:x,
            actionTime:actionTime,
        }
    }
    //上阵怪后的处理
    public setHaveAdd(actionTime){
        this.actionTime = actionTime;
        this.actionResult = 0;
        this.num ++;
    }
}