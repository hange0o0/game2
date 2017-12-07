class PosListHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosListHeadItemSkin";
    }

    private bg: eui.Image;
    private img: CardImg;




    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        var vo:any = CM.getCardVO(this.data);
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
    }

}