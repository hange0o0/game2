class CardImg extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "CardImgSkin";
    }

    private img: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
         this.img.source = CM.getCardVO(this.data).getImage();
    }

}