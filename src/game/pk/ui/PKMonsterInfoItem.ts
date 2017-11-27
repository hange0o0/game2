class PKMonsterInfoItem extends game.BaseItem {

    private bg: eui.Image;
    private img: eui.Image;
    private barMC: eui.Image;


    public constructor() {
        super();

        this.skinName = "PKMonsterInfoItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

    }


    public dataChanged(){
        var vo:any = this.data.getVO();
        this.img.source = vo.getImage();
        this.bg.source = vo.getBG();

        this.img.visible = this.data.dieTime > 0;          //@
        this.onTimer();
    }

    public onTimer(){
       this.barMC.width = 76 * this.data.hp/this.data.maxHp;
    }
}
