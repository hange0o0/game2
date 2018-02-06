class CardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CardItemSkin";
    }

    private bg: eui.Image;
    private img: CardImg;
    private nameText: eui.Label;
    private redMC: eui.Image;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private costText: eui.Label;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){

    }

    public dataChanged(){
        var vo:any = this.data
        this.img.data = vo.id;
        this.bg.source = vo.getBG();


        //this.skillType.visible = false
        this.spaceGroup.visible = false
        //if(vo.isMonster)
        //{
        //    this.skillType.visible = false
        //    this.spaceGroup.visible = true
        //    this.spaceText.text = vo.space + '';
        //}
        //else
        //{
        //    this.skillType.visible = true
        //    this.spaceGroup.visible = false
        //    this.skillType.source = vo.getTypeIcon();
        //}

        this.costText.text = vo.cost;
        this.nameText.text = vo.name;
    }

}