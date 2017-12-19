class S104 extends SBase {
    constructor() {
        super();
    }

    public mvID = 123;

    //预加载
    public preload() {
        AniManager.getInstance().preLoadMV(this.mvID)
    }

    //取技能目标
    public getSkillTarget(user:PKPosCardData){
        var PD = PKData.getInstance();
        return PD.getMonsterByTeam(user.getOwner().teamData);
    }

    //生效时的逻辑
    public onSkill(user:PKPosCardData,target:PKMonsterData){
        var skillValue = user.getSkillValue(1);
        var addValue = Math.floor(target.baseAtk * skillValue/100);
        //target.atk += addValue;
        var buff = new PKBuffData()
        buff.user = user;
        buff.id = 104;
        buff.value = skillValue;
        buff.endTime = PKData.getInstance().actionTime + user.getSkillValue(2)*1000;
        buff.addValue('atk',addValue)
        target.addBuff(buff)

        if(buff.ing)
        {
            PKData.getInstance().addVideo({
                type:PKConfig.VIDEO_MONSTER_ADD_STATE,
                user:target,
                key:1,
                stateType:1
            })
        }
    }
}