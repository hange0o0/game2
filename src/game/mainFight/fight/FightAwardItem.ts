class FightAwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FightAwardItemSkin";
    }

    private cardMC: CardItem;
    private cb: eui.CheckBox;

    public childrenCreated() {
        super.childrenCreated();
        this.touchChildren = false
        this.cardMC.justInfo = true
        MyTool.addLongTouch(this,this.onLongTouch,this)
        //this.addBtnEvent(this,this.onClick)
    }

    private onLongTouch(){
        PKCardInfoUI.getInstance().show({
            mid:this.data,
            force:UM.tec_force,
            type:UM.type
        })

    }

    public dataChanged(){
         this.cardMC.data = CM.getCardVO(this.data);
    }
}