//出战区的怪
class PKPosCardData {
    public id;//唯一ID 1-4
    public mid //对应的怪
    public owner//主人ID
    public isAuto = false//是否自动出怪上阵的

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

        this.getVO().preLoad();
    }

    public getVO(){
        if(this.mid < 100)
            return MonsterVO.getObject(this.mid)
        return SkillVO.getObject(this.mid)
    }

    public getOwner(){
        return PKData.getInstance().getPlayer(this.owner);
    }

    public useEnable(){
        if(this.mid < 100)
        {
            var mvo = MonsterVO.getObject(this.mid)
            if(this.isAuto)
                return this.num < mvo.num2;
            return this.num < mvo.num;
        }

        var svo = SkillVO.getObject(this.mid)
        if(svo.num == 0)
            return this.actionTime + svo.cd >= PKData.getInstance().actionTime;
        return this.num < svo.num;
    }

    public getNextCD(){
        var PD = PKData.getInstance();
        if(this.actionResult)
            return 0;
        var nextTime = this.actionTime + this.getMaxCD();
        return Math.max(0,nextTime - PD.actionTime);
    }

    public getMaxCD(){
        if(this.num == 0)
            return PKConfig.beforeCD;
        else
            return this.getVO().cd;
    }

    //是否可马上起作用
    public testAdd(t){
        if(this.actionResult)
            return true;
        if(!this.useEnable())
        {
            return false;
        }
        var cd = this.getMaxCD();
        if(t - this.actionTime > cd)
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
        var x = atkRota == PKConfig.ROTA_LEFT ? 0:PKConfig.floorWidth;
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

    public getSkillValue(){
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(this.owner);
        var base = owner.base[this.mid];
        return base.value;
    }

    //触发技能
    public actionSkill(){
       SBase.getData(this.mid).skill(this);
    }

    //上阵怪后的处理
    public setHaveAdd(actionTime){
        this.actionTime = actionTime;
        this.actionResult = 0;
        this.num ++;
    }
}