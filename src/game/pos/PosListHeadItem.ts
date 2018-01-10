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
        //var gay = this.data.indexOf('@') == 0;
        //if(gay)
        //    this.data = this.data.substr(1);
        var vo:any = CM.getCardVO(this.data);
        if(vo)
        {
            this.img.visible = true
            this.img.data = vo.id;
            //if(gay)
            //    this.img.changeGay(true)
            this.bg.source = vo.getBG();
        }
        else
        {
            this.img.visible = false
        }

    }


}