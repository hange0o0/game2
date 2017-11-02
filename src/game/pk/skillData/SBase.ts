class SBase {
    private static baseData = {};

    public static getData(id):SBase {
        if (!this.baseData[id]) {
            var myClass = eval("S" + id);
            this.baseData[id] = new myClass();
        }
        return this.baseData[id];
    }


    public type = 'skill'

    constructor() {
    }

    //预加载
    public preload() {

    }

    //能否生效
    public useAble(){
        return true;
    }

    //取技能目标
    public getSkillTarget(user:PKPosCardData){
        return [];
    }

    //技能动画
    public skillMV(target:PKMonsterData){

    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData,target:PKMonsterData){

    }


    //////////////////////////////////////////////////上面的为要设的内容

    //实现技能
    public skill(user:PKPosCardData){
        var targets = this.getSkillTarget(user);
        for(var i=0;i<targets.length;i++)
        {
            this.onSkill(user,targets[i]);//技能效果
            this.skillMV(targets[i]);//技能效果
        }
    }




}