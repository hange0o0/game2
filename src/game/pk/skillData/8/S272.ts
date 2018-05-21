class S272 extends SBase {
    constructor() {
        super();
    }

    public onDie(user:PKPosCardData){
        var add = SkillVO.getObject(user.mid).cost;
        user.getOwner().addMP(user.getSkillValue(1) + add)
    }
}