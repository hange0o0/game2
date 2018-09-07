class PKChooseCardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKChooseCardItemSkin";
    }

    private cardMC: CardItem;

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false
        this.cardMC.justInfo = true
        MyTool.addLongTouch(this,this.onLongTouch,this)
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){

    }

    private onLongTouch(){
        CardInfoUI.getInstance().show(CM.getCardVO(this.data),{})
    }

    public dataChanged(){
        this.cardMC.data = CM.getCardVO(this.data);
    }
}