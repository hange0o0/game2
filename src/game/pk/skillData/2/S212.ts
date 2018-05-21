class S212 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var teamData = user.getOwner().teamData;
        teamData.toFront ++;
        return [];
    }

    public onDie(user:PKPosCardData){
        var teamData = user.getOwner().teamData;
        teamData.toFront --;
    }
}
