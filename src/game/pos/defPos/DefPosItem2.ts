class DefPosItem2 extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosItem2Skin";
    }

    private bg: eui.Image;
    private img: CardImg;


    public childrenCreated() {
        super.childrenCreated();
    }


    public onClick(){
    }

    public dataChanged(){
        var vo:any = CM.getCardVO(this.data)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
    }
}