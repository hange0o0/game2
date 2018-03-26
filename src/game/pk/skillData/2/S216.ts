class S216 extends SBase {
    constructor() {
        super();
    }

    public onDie(user:PKPosCardData){
        user.getOwner().addMP(user.getSkillValue(1))
    }
}