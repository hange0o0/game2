class CardImg extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "CardImgSkin";
    }

    private img: eui.Image;
    private txt: eui.Label;



    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
         this.img.source = CM.getCardVO(this.data).getImage();
         if(this.data > 100)
            this.txt.text = CM.getCardVO(this.data).name + '\n' + this.data;
        else
             this.txt.text = ''
    }

}