class S501 extends SBase {
    constructor() {
        super();
    }

    public onSkill(user:PKPosCardData) {
        var PD = PKData.getInstance();
        var player = user.getOwner()
        if(PD.isReplay || player != PD.myPlayer)
            return [];
        var mp = player.getMP()
        if(mp >= 18 && player.getPosNum() <= 1)
        {
            var arr = [];
            var handCard = player.getHandCard()
            for(var s in handCard)
            {
                if(!handCard[s])
                    continue;
                if(CM.getCardVO(handCard[s].mid).cost <= mp)
                    arr.push(handCard[s])
            }

            var cardData = PD.randomOne(arr)
            player.addPosCard(cardData)
            PD.addVideo({
                type:PKConfig.VIDEO_AUOT_ADD_CARD,
                user:cardData
            })
        }
        return [];
    }
}