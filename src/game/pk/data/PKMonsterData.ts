//场上的怪
class PKMonsterData {
    public die = false;

    public hp = 0
    public maxHp = 0
    public atk  = 0
    public speed  = 0
    public def  = 0
    public buff = [];

    public id;//唯一ID
    public x;//当前的位置
    public mid //对应的怪
    public owner//属于哪个玩家
    public actionTime//上次行动的时间
    public atkRota//进攻方向
    public target:PKMonsterData//攻击目标

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

    public canMove(){

    }

    public canBeAtk(user){
        return !this.die;
    }

    public move(){
        this.x += this.atkRota * Math.round(this.speed);
    }

    public getAtkTarget(list){
        var atkRage = 50
        if(this.target)
        {
            if(this.target.canBeAtk(this) && Math.abs(this.target.x - this.x) < atkRage)
            {
                 return this.target;
            }
            else
                this.target = null;
        }

        //找最近的
        var des = 0;
        var PD = PKData.getInstance();
        var myPlayer = PD.getPlayer(this.owner);
        for(var i=0;i<list.length;i++)
        {
            var target = list[i];
            var tDes = Math.abs(this.target.x - this.x);
            if(tDes < atkRage && target.canBeAtk(this)) {

                var ePlayer = PD.getPlayer(target.owner);
                if(myPlayer.teamData.id == ePlayer.teamData.id)//同一队
                    continue;

                if (!this.target || des > tDes)
                {
                    this.target = target;
                    des = tDes;
                }
            }
        }
        return  this.target
    }

    public atkAction(data){

    }

    public beAtkAction(data){
        this.hp -= data.hp;
        if(this.hp <= 0)
            this.die = true;
    }
}