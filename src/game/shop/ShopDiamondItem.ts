class ShopDiamondItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "ShopDiamondItemSkin";
    }

    private diamondText: eui.Label;
    private costText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){

    }

}