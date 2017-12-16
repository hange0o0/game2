//场上的怪
class PKMonsterData {
    public die = false;

    public hp = 0
    public atk  = 0
    public speed  = 0
    public def  = 0
    public maxHp = 0
    public hpChange = 0  //每0.5秒改变的HP值
    public lastHpChange = 0  //上次改变的HP值的时间
    public atkAble = true  //可以攻击

    //隐藏属性
    public doubleRate  = 0
    public doubleValue  = 0
    public doubleAction  = false;
    public missRate  = 0
    public momian  = false

    public baseHp = 0
    public baseAtk  = 0
    public baseSpeed  = 0
    public posAdd  = 0




    public x;//当前的位置
    public y;//当前的位置
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

    public currentState = {};//当前的特殊状态
    public stateChange = false


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
        var add = mvo.getAdd(obj.force,this.getOwner().type);
        this.hp = Math.floor(mvo.hp * add);
        this.atk = Math.floor(mvo.atk * add);
        this.speed = mvo.speed;
        this.def = mvo.def;

        if(this.posAdd == 1)
            this.atk = Math.floor(this.atk*1.1);
        else if(this.posAdd == 2)
            this.hp = Math.floor(this.hp*1.1);
        else if(this.posAdd == 3)
            this.def += 5;

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

    //public changeValue(key,value){
    //    if(key == 'speed' || key == 'def' || key == 'atk' || key == 'hpChange')
    //        this[key] += value;
    //}

    public beSkillAble(){
        return this.momian == false;
    }

    //{endTime,  add:{属性名称:增加值}，   state:{状态名：true},   id:唯一ID,   no:这BUFF没生效,   value:技能等级数值}
    public addBuff(data:PKBuffData){
        data.owner = this;
        this.buff.push(data);
        if(data.id)
            this.resetBuffID(data.id);
        else
            data.enable();

        if(data.ing && data.haveState)
            this.resetState();
    }

    //清除状态
    public cleanBuff(t,user?){
        var needTestStat = false
        var needTestId = null
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            var needClean = oo.endTime && t && oo.endTime <= t
            if(user && user == oo.user)
                needClean = true;
            if(needClean)
            {
                this.buff.splice(i,1);
                i--;
                if(oo.ing)
                {
                    if(oo.haveState)
                        needTestStat = true;
                    if(oo.id)
                    {
                        if(!needTestId)
                            needTestId = {};
                        if(!needTestId[oo.id])
                            needTestId[oo.id] = true;
                    }
                }
                oo.disable();
            }
        }
        if(needTestId)
        {
            for(var s in needTestId)
                this.resetBuffID(s);
        }
        if(needTestStat)
            this.resetState();
    }

    //判断是否在某个状态中
    public isInState(stateName){
        return this.currentState[stateName];
    }

    //重置状态
    public resetState(){
        var lastState = this.currentState;
        this.currentState = {};
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            if(oo.ing && oo.haveState)
            {
                for(var s in oo.state)
                {
                    this.currentState[s] = true;
                    if(!lastState[s]) //新增了状态
                        this.stateChange = true;
                }
            }
        }

        if(!this.stateChange)
        {
            for(var s in lastState)
            {
                 if(!this.currentState[s]) //去除了状态
                 {
                     this.stateChange = true;
                     break;
                 }
            }
        }
    }

    //对ID唯一的技能进行重置
    public resetBuffID(id){
        var ids = []//所有相同ID的BUFF
        var current:PKBuffData;
        for(var i=0;i<this.buff.length;i++)
        {
            var oo:PKBuffData =  this.buff[i];
            if(oo.id == id)
            {
                ids.push(oo);
                if(oo.ing)
                    current = oo
            }
        }
        if(!ids.length)  //没技能
            return
        if(ids.length == 1 && current) //只有唯一技能
            return
        var newOne:PKBuffData;
        for(var i=0;i<ids.length;i++)
        {
            var oo:PKBuffData = ids[i];
            if(!newOne || Math.abs(oo.value) > Math.abs(newOne.value))
                newOne = oo;
        }
        if(!current) //以前没有
        {
            newOne.enable();
            return
        }
        if(newOne != current && newOne.value != current.value)
        {
            newOne.enable();
            current.disable();
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
        if(!this.canAction())
            return false
        if(!this.atkAble && PKData.getInstance().currentState == 'def'){
             if(this.atkRota == PKConfig.ROTA_LEFT && this.x > PKConfig.floorWidth/2 + PKConfig.appearPos - 100)
                 return false
             if(this.atkRota == PKConfig.ROTA_RIGHT && this.x < PKConfig.floorWidth/2 + PKConfig.appearPos + 100)
                 return false
        }
        return this.stopTime < t;
    }

    //可以有行为 如移动，攻击等
    public canAction(){
        return !this.die && !this.isInState(PKConfig.STATE_YUN)
    }

    public canAtk(){
        var PD =  PKData.getInstance();
        return  this.atkAble && this.canAction() &&  this.stopTime <= PD.actionTime
    }

    public canBeAtk(user){
        return !this.die &&
            user.getOwner().teamData != this.getOwner().teamData;
    }

//可以用技能
    public canSkill(t){
        if(this.owner == 'sys')
            return null;
        if(!this.canAction())
            return null;
        if(this.stopTime > t)
            return null;
        if(!this.getVO().skillcd) //无技能
            return null;
        //if(this.getVO().skillcd > 0 && !this.target && !this.getAtkTarget())
        //    return null;
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
    public stand(){
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_STAND,
            user:this
        })
    }

    public getAtkTarget(){
        if(this.owner == 'sys')
            return null;
        var PD = PKData.getInstance();
        if(!this.canAtk())
            return null;
        var atkRage = this.getVO().getAtkDis();
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
        this.addHp(-data.hp)
        MBase.getData(this.mid).beAtkAction(this,data);
    }

    public addHp(hp){
        this.hp += hp;
        if(this.hp <= 0)
            this.die = true;
        else if(this.hp > this.maxHp)
            this.hp = this.maxHp
        PKData.getInstance().addVideo({
            type:PKConfig.VIDEO_MONSTER_HPCHANGE,
            user:this,
        })
    }

    public getHpRate(){
        return this.hp / this.maxHp
    }

    public onDie(){
        MBase.getData(this.mid).onDie(this);
        this.getOwner().teamData.testState(PKConfig.LISTENER_DIE,this);
    }

    public getSkillValue(index,needForce=false){
        var PD = PKData.getInstance();
        return CM.getCardVO(this.mid).getSkillValue(index,needForce?PD.getPlayer(this.owner).force:0)
    }
}