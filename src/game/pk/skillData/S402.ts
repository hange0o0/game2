class S402 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        user.getOwner().addMP(user.getSkillValue(1))
        return [];
    }
}