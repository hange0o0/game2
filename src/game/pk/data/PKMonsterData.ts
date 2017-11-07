//场上的怪
class PKMonsterData {
    public die = false;

    public hp = 0
    public atk  = 0
    public speed  = 0
    public def  = 0
    public maxHp = 0

    //隐藏属性
    public doubleRate  = 0
    public doubleValue  = 0
    public doubleAction  = false;
    public missRate  = 0

    public baseHp = 0
    public baseAtk  = 0
    public baseSpeed  = 0




    public x;//当前的位置
    public mid //对应的怪
    public owner//属于哪个玩家
    public actionTime//上次行动的时间
    public atkRota//进攻方向

    public target:PKMonsterData//攻击目标
    public skillTargets//技能目标

    public id;//唯一ID

    public stopTime = 0
    public lastSkill = 0
    public dieTime = 0
    public buff = [];


    constructor(obj?){
        if(obj)
            this.fill(obj);
    }

    public fill(obj)
    {
        for (var key in obj) {
            this[key] = obj[key];
        }
        var mvo = MonsterVO.getObject(this.mid);
        var typeAdd = mvo.type == this.getOwner().type?PKConfig.typeAdd:0
        var add = (1+obj.force/100)*(1+typeAdd/100);
        this.hp = Math.floor(mvo.hp * add);
        this.atk = Math.floor(mvo.atk * add);
        this.speed = mvo.speed;
        this.def = mvo.def;

        this.maxHp = this.hp;
        this.baseHp = this.hp;
        this.baseAtk = this.atk;
        this.baseSpeed = this.speed;



        MBase.getData(this.mid).initMonster(this);
        //this.def += this.getVO().def;
    }

    //根据属性相克，取攻击比例
    public getAtkRate(defender:PKMonsterData){
         var atkType = this.getVO().type
         var defType = defender.getVO().type
        if(defType == 0 || atkType == 0)
            return 1;
        var des = Math.abs(atkType - defType)
        if(des == 0)
            return 1;
        if(des == 1)
        {
            if(atkType< defType)
                return 1.5;
            return 0.5
        }
        if(atkType > defType)
            return 1.5;
        return 0.5
    }

    public addBuff(data){
         this.buff.push(data);
    }
    public cleanBuff(t){
        for(var i=0;i<this.buff.length;i++)
        {
            var oo =  this.buff[i];
            if(oo.endTime <= t)
            {
                this.buff.splice(i,1);
                i--;
                for(var s in oo)
                {
                    if(s != 'endTime')
                    {
                        this[s] -= oo[s];
                    }
                }
            }
        }
    }

    public getVO():MonsterVO{
        return MonsterVO.getObject(this.mid);
    }
    public getOwner(){
        return PKData.getInstance().getPlayer(this.owner);
    }

    public canMove(t){
        if(this.owner == 'sys')
            return false;
         return this.stopTime < t;
    }

    public canBeAtk(user){
        return !this.die &&
            user.getOwner().teamData != this.getOwner().teamData;
    }

    //可以用技能
    public canSkill(t){
        if(this.owner == 'sys')
            return null;
        if(this.die)
            return null;
        if(this.stopTime > t)
            return null;
        if(!this.getVO().skillcd) //无技能
            return null;
        if(this.getVO().skillcd > 0 && !this.target && !this.getAtkTarget())
            return null;
        if(this.lastSkill && (this.lastSkill + this.getVO().skillcd > t))
            return null;
        this.skillTargets = MBase.getData(this.mid).getSkillTarget(this);
        return this.skillTargets
    }

    public setSkillUse(){
        if(this.getVO().skillcd < 0)
            this.lastSkill = Number.MAX_VALUE;
        else
            this.lastSkill = PKData.getInstance().actionTime;
    }

    public move(){
        this.x += this.atkRota * Math.round(this.speed);
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_MOVE,
            user:this
        })
    }

    public getAtkTarget(){
        if(this.owner == 'sys')
            return null;
        var PD = PKData.getInstance();
        if(this.stopTime > PD.actionTime)
            return null;
        var atkRage = this.getVO().atkrage;
        if(this.target)
        {
            if(this.target.canBeAtk(this) && Math.abs(this.target.x - this.x) < atkRage + this.target.getVO().width/2)
            {
                 return this.target;
            }
            else
                this.target = null;
        }

        //找最近的
        var des = 0;
        var list = PD.monsterList
        var myPlayer = PD.getPlayer(this.owner);
        for(var i=0;i<list.length;i++)
        {
            var target:PKMonsterData = list[i];
            var tDes = Math.abs(target.x - this.x);
            if(tDes < atkRage + target.getVO().width/2 && target.canBeAtk(this)) {

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

        MBase.getData(this.mid).beAtkAction(this,data);

        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_BEATK,
            user:this,
        })
    }
}