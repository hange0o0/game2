class S106 extends SBase {
    constructor() {
        super();
    }

    public getSkillTarget(user:PKPosCardData){
        return [null];
    }

    public onSkill(user:PKPosCardData,target:PKMonsterData) {
        var PD = PKData.getInstance();
        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
        var selectTarget
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i];
            if(temp.hp >= temp.maxHp)
                continue;

            temp.temp = temp.getHpRate();
            if(!selectTarget || selectTarget.temp > temp.temp)
                selectTarget = temp
        }
        if(selectTarget)
        {
            selectTarget.addHp(user.getSkillValue(1,true))
        }
    }


}


//class S106StateListener extends PKStateListener {
//    public type = PKConfig.LISTENER_TIMER
//    public actionTime
//    constructor() {
//        super();
//        //this.actionTime = PKData.getInstance().actionTime;
//    }
//
//    // 起作用时会调用的方法
//    public actionFun(target?:PKMonsterData){
//        if(PKData.getInstance().actionTime - this.actionTime < user.getSkillValue(2) *1000)
//            return;
//
//        var user:PKPosCardData = <PKPosCardData>this.owner;
//        var PD = PKData.getInstance();
//        var arr = PD.getMonsterByTeam(user.getOwner().teamData);
//        var selectTarget
//        for(var i=0;i<arr.length;i++)
//        {
//            var target = arr[i];
//            if(target.hp >= target.maxHp)
//                continue;
//
//            target.temp = target.getHpRate();
//            if(!selectTarget || selectTarget.temp > target.temp)
//                selectTarget = target
//        }
//        if(selectTarget)
//        {
//            this.actionTime = PKData.getInstance().actionTime;
//            selectTarget.addHp(user.getSkillValue(1,true))
//        }
//    }
//}