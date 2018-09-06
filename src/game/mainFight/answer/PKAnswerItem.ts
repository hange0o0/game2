class PKAnswerItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKAnswerItemSkin";
    }

    private bg: eui.Image;
    private img: CardImg;
    private costText: eui.Label;
    private indexText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){
        CardInfoUI.getInstance().show(CM.getCardVO(this.data.id),{force:1000,type:0});
    }

    public dataChanged(){
        var vo:any = CM.getCardVO(this.data.id)
        this.bg.source = vo.getBG();
        this.costText.text = vo.cost;
        this.img.data = vo.id;
        this.indexText.text = this.data.index
    }

    public changeGay(b){
        this.img.changeGay(b)
    }

}