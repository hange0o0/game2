class S217 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        for(var s in user.getOwner().posCard)
        {
            var posCard:PKPosCardData = user.getOwner().posCard[s]
            if(posCard && posCard.mid < PKConfig.skillBeginID && posCard.num>0)
            {
                posCard.actionTime -= user.getSkillValue(1)*1000;
            }
        }
        return [];
    }
}