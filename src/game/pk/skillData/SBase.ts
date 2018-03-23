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

    public onIll(buff:PKBuffData){

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
    *  对最前方的300范围内的敌人造成80点伤害
    *  对最前方的200范围内的敌人造成200点伤害
    *  战场上随机单位造成200伤害，1秒1次 10次
    *  最高的敌方血量单位造成400伤害，2秒1次 5次
     * 回复场上所有单位 300 血量
     * 降低场上所有X属性的敌人的50%攻击力
     * 增加场上所有X属性的单位的30%攻击力
     * 提高接下来产出单位100点生命值，持续15秒
     * 获得复活能力
     *
     *
     *
    * 在最前方建立一个治疗图腾，对#1范围内的友军每秒回复$2血量
    * 加快所有单位#1%速度，持续#2秒
    * 消灭地图上所有的XX单位
    * 在最前方召唤XX个XX
    * 治疗图腾，火焰图腾，
    * 雷电法师 *3 10s
    * 幻影剌客 *5 3s
    * 宝石狂徒
    * 矿工 *5 10s
    * 重装撕裂者
    * 掌旗使 *1 20s
     重装撕裂者
     狂战士
     斧王
     守卫者
     巫医
     蛮荒兽人
     近战巫师
     推车兽人
     盾卫
     重装斧卫
     毒巫师
     铁甲卫士
     饥饿兽人
     黑蘑菇
     绿蘑菇
     橙蘑菇
     蓝蘑菇
     红蘑菇
     牛头人
     豌豆
     黑石人
     橙石人
     蓝石人
     红石人
     黑风人
     红风人
     蓝风人
     橙风人
     蛇女
     火元素
     黑泥怪
     橙泥怪
     绿泥怪
     骷髅弓箭手
     骷髅士兵
     死神
     骷髅矿工
     幽灵
     亡灵
     蓝泥怪
     巫妖
     红袍怨灵
     木乃伊
     白袍怨灵
     树人操控者
     红泥怪
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