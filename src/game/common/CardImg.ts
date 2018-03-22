class CardImg extends game.BaseItem{
    public constructor() {
        super();
        this.skinName = "CardImgSkin";
    }

    private img: eui.Image;
    private txt: eui.Label;



    public lastSource;
    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
        this.changeGay(false)
    }

    public changeGay(b){
        var source = CM.getCardVO(this.data).getImage(b);
        if(source != this.lastSource)
        {
            this.img.source = source
            this.lastSource = source;
        }
        if(this.data > PKConfig.skillBeginID)
            this.txt.text = CM.getCardVO(this.data).name + '\n' + this.data;
        else
            this.txt.text = ''
    }

}