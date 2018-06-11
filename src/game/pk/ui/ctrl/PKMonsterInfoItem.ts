class PKMonsterInfoItem extends game.BaseItem {

    private bg: eui.Image;
    private img: CardImg;
    private barMC: eui.Image;
    private callMC: eui.Image;




    public constructor() {
        super();

        this.skinName = "PKMonsterInfoItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.img.hideType = true;
    }


    public dataChanged(){
        var vo:any = this.data.getVO();
        this.img.data = vo.id;
        this.bg.source = vo.getBG();

        this.callMC.visible = this.data.dieTime > 0;
        this.onTimer();
    }

    public onTimer(){
        var barWidth = 204
       this.barMC.width = barWidth * this.data.hp/this.data.maxHp;
    }
}
