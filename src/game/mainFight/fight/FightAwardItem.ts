class FightAwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FightAwardItemSkin";
    }

    private cardMC: CardItem;
    private cb: eui.CheckBox;

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
         this.cardMC.data = MonsterVO.getObject(this.data);
        console.log(999)
    }
}