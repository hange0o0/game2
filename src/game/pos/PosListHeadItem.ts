class PosListHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosListHeadItemSkin";
    }

    private bg: eui.Image;
    private wenhao: eui.Image;
    private img: CardImg;




    public childrenCreated() {
        super.childrenCreated();
        this.img.hideType = true;
        //this.addBtnEvent(this,this.onClick)
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
            this.currentState = 'normal'
        }
        else
        {
            this.img.visible = false
            this.currentState = 'unknow'
            this.bg.source = 'border_16_png'
        }

    }

    public setGray(b){
        this.img.changeGay(b)
    }


}