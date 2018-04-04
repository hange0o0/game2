class SBase {
    private static baseData = {};

    //ID是由200开始，所以要
    public static getData(id):SBase {
        if (!this.baseData[id]) {
            var myClass = eval("S" + id);
            this.baseData[id] = new myClass();
            this.baseData[id].id = id
        }
        return this.baseData[id];
    }
    public mvID1
    public mvID2
    public mvID3

    public type = 'skill'
    public id

    constructor() {
    }

    public initSkill(user:PKPosCardData){

    }

    public onDie(user:PKPosCardData){

    }

    //对Buff进行处理
    public onBuff(buff:PKBuffData){

    }

    public preload(){
        if(this.mvID1)
            AtkMVCtrl.getInstance().preLoadMV(this.mvID1)
        if(this.mvID2)
            AtkMVCtrl.getInstance().preLoadMV(this.mvID2)
        if(this.mvID3)
            AtkMVCtrl.getInstance().preLoadMV(this.mvID3)
    }

    //技能动画
    public skillMV(target:PKMonsterData){
        AtkMVCtrl.getInstance().sSkillMV(this.id,target)
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData){
         return [];
    }



    //////////////////////////////////////////////////上面的为要设的内容

    //通用的召唤方法
    public addMonsterSkill(user,mid,type=0,noSkill?){
        var PD = PKData.getInstance();
        var owner = PD.getPlayer(user.owner);
        var atkRota = owner.teamData.atkRota;
        var item = null;
        if(type == 1)//我方前线
            item = PKData.getInstance().getFirstItem(owner.teamData.id);
        else if(type == 2)//敌人后方
            item = PKData.getInstance().getBackItem(owner.teamData.enemy.id);
        var x:any;
        if(item)
        {
            x = item.x + PD.rand(-10,10);
        }
        else
        {
            x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        }
        var num = user.getSkillValue(1);
        var cd = user.getSkillValue(2)*1000;
        for(var i=0;i<num;i++)
        {
            var mData:any = {
                force:owner.force,
                mid:mid,
                owner:user.owner,
                atkRota:atkRota,
                x:x,
                y:-25 + Math.random()*50,
                actionTime:PD.actionTime,
                dieTime:PD.actionTime + cd
            }
            if(noSkill)
                mData.lastSkill = Number.MAX_VALUE
            PD.addMonster(mData);
        }
        return [];
    }

    //实现技能
    public skill(user:PKPosCardData){
        //var svo = SkillVO.getObject(user.mid);

        var targets = this.onSkill(user);//技能效果
        if(targets)
        {
            for(var i=0;i<targets.length;i++)
            {
                this.skillMV(targets[i]);//技能动画
            }
        }

        //if(svo.state)
        //{
        //    user.getOwner().teamData.addStateLister(svo.state,user)
        //    return;
        //}
        //var targets = this.getSkillTarget(user);
        //for(var i=0;i<targets.length;i++)
        //{
        //
        //}
    }

    /*
    *  回复我方所有单位 30 血量    1
    *  对所有敌人造成20点伤害，对召唤单位伤害翻倍    2
    *  对最前方的300范围内的敌人造成80点伤害    3
    *  对最前方的200范围内的敌人造成200点伤害  4
    *  战场上随机单位造成200伤害，1秒1次 10次    7
    *  最高的敌方血量单位造成400伤害，2秒1次 5次    7
     * 回复场上所有单位 300 血量  4
     * 降低场上所有堡垒属性的敌人的50%攻击力   4
     * 降低场上所有自然属性的敌人的50%攻击力   4
     * 降低场上所有幽暗属性的敌人的50%攻击力   4
     * 增加场上所有堡垒属性的单位的30%攻击力   4
     * 增加场上所有自然属性的单位的30%攻击力   4
     * 增加场上所有幽暗属性的单位的30%攻击力   4
     * 永久提高新产出单位100点生命值，持续15秒   5
     * 永久提高新产出单位20点攻击力，持续15秒   5
     * 永久提高新产出单位10点防御，持续15秒   5
     * 永久提高新产出单位200点生命值，持续15秒   8
     * 永久提高新产出单位40点攻击力，持续15秒   8
     * 永久提高新产出单位20点防御，持续15秒   8
     * 对敌方新产出单位造成50点伤害，持续15秒   5
     * 进化，提升已方单位随机一项属性20%，[生命上限，攻击，移动，速度，防御]   5
     * 使我方所有单位获得抵挡1次伤害的能力，并回复30点生命   3
     * 使我方所有单位获得抵挡3次伤害的能力   4
     * 使我方随机3个单位获得魔盾，可抵挡200点伤害   5
     * 晕所有敌人，持续3秒    4
     * 晕所有敌人，持续5秒    6
     * 晕所有敌人，并造成100点伤害，持续4秒    8
     * 随机消灭场上3个单位  3
     * 随机消灭场上5个单位  5
     * 随机消灭场上8个单位  8
     * 随机消灭敌人1个单位  2
     * 随机消灭敌人3个单位  5
     * 随机消灭敌人5个单位  8
     * 消灭场上所有单位  12
     * 使我方单位获得持续回血能力，每秒回复10点生命，持续10秒    3
     * 使我方单位获得持续回血能力，每秒回复20点生命，持续10秒    5
     * 使我方单位获得持续回血能力，每秒回复30点生命，持续15秒    8
     * 使敌人中毒，每秒降低10点生命，持续10秒    3
     * 使敌人中毒，每秒降低20点生命，持续10秒     5
     * 使敌人中毒，每秒降低30点生命，持续15秒     8
     * 消灭所有血量低于100的单位  5
     * 消灭所有召唤单位  5
     * 所有单位获得魔免，持续10秒   5
     * 增加队伍1点生命   6
     * 增加队伍2点生命   12
     * 增加队伍3点生命   18
     * 伤害对方队伍1点生命   6
     * 伤害对方队伍2点生命   12
     * 伤害对方队伍3点生命   18
     * 7秒后获得+1点能量    5
     * 12秒后获得+2点能量   8
     * 15秒后获得+3点能量   12
     * 20秒后获得+4点能量   15
     * 30秒后获得+5点能量   18
     * 缓速图腾 降低战场上所有单位30%速度     3
     * 加速图腾 增加战场上所有单位30%速度     3
     * 恐惧，降低所胡敌人20点护甲，持续5秒     5
     * 对所有敌人造成60点堡垒属性的伤害  2
     * 对所有敌人造成60点自然属性的伤害  2
     * 对所有敌人造成60点幽暗属性的伤害  2
     * 对所有敌人造成100点堡垒属性的伤害  3
     * 对所有敌人造成100点自然属性的伤害  3
     * 对所有敌人造成100点幽暗属性的伤害  3
     * 对所有敌人造成200点堡垒属性的伤害  5
     * 对所有敌人造成200点自然属性的伤害  5
     * 对所有敌人造成200点幽暗属性的伤害  5
     * 对所有敌方召唤单位造成150点伤害  4
     * 使场上所有召唤单位的存活时间增加10秒 5
    * 在最前方建立一个治疗图腾，对200范围内的友军每秒回复30血量，持续10秒  5
    * 在最前方建立一个火焰图腾，对200范围内的敌军每秒造成30点伤害，持续10秒  5
    * 消灭地图上所有的堡垒属性的单位   7
    * 消灭地图上所有的自然属性的单位   7
    * 消灭地图上所有的幽暗属性的单位   7
    * 召唤3个雷电法师，存活10秒    *3 10s        5
    * 在敌方后排召唤3个幻影剌客，存活5秒   *3 5s 后排     3
    * 每秒召唤一个矿工，每个矿工存活10秒  10s cd1s   3
    * 召唤一个掌旗使，存活20秒 *1 20s     5
     召唤2个狂战士，存活10秒  *2 10s     4
     召唤1个巫医，存活30秒  *1 30s    4
     召唤1个蛮荒兽人，存活30秒   *1    30s   6
     在最前线召唤1个盾卫，存活30秒    *1 前线  30s   4
    在敌方后排召唤1个铁甲卫士，存活30秒   *1    30s  后排  7
     召唤1个饥饿兽人，存活40秒  *1    40s   9
     召唤1个黑蘑菇，存活15秒     *1    15s   1
     召唤1个绿蘑菇，存活15秒      *1    15s   1
     召唤1个橙蘑菇，存活15秒      *1    15s   1
     召唤1个蓝蘑菇，存活15秒      *1    15s   1
     召唤1个红蘑菇，存活8秒       *1    8s   1
     召唤5种不同的蘑菇，存活20秒 20s   7
     召唤1个黑石人，存活30秒    *1  30s   4
     在最前线召唤1个橙石人，存活20秒    *1 前线  20s   3
     在最前线召唤1个蓝石人，存活10秒      *1 前线  10s   2
     召唤1个红石人，存活30秒      *1  30s   3
     召唤1个黑泥怪，存活10秒    *1    10s   2
     召唤1个橙泥怪，存活10秒    *1    10s   2
     召唤1个绿泥怪，存活10秒    *1    10s   2
     在敌方后排召唤5个骷髅弓箭手，存活10秒  *5   10s  后排 3
     召唤3个骷髅士兵，存活10秒   *3   10s   1
     召唤1个蓝泥怪，存活10秒      *1    10s   2
     召唤3个木乃伊，存活15秒    *3   15s   1
     召唤1个红泥怪，存活10秒        *1    10s   2
     *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    * */




}