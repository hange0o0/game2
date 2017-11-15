class CardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CardItemSkin";
    }

    private des: eui.Label;
    private nameText: eui.Label;
    private spaceText: eui.Label;
    private costText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){

    }

    public dataChanged(){
        this.nameText
    }

}