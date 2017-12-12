class M7 extends MBase {
    constructor() {
        super();
    }

    //初始化怪物隐藏属性
    public initMonster(user:PKMonsterData){
        user.doubleValue = 2;
    }

    public atkAction(user:PKMonsterData,target:PKMonsterData,actionTime){
        if(user.getHpRate() < 0.3)
        {
            user.doubleRate = 1;
        }
        super.atkAction(user,target,actionTime);
        user.doubleRate = 0
    }

    //protected getAtkerAtk(user:PKMonsterData,target:PKMonsterData){
    //    var atk = super.getAtkerAtk(user,target);
    //    if(user.getHpRate() < 0.3)
    //    {
    //        atk *= 2;
    //    }
    //    return atk;
    //}
}