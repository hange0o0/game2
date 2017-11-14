class PosCardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CardItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    public onLongTouch(){

    }

    public onClick(){
       this.dispatchEventWith('choose_card',this.data)
    }

    public dataChanged(){

    }
}