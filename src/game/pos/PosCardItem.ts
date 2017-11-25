class PosCardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CardItemSkin";
    }

    private bg: eui.Image;
    private img: eui.Image;
    private nameText: eui.Label;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private costText: eui.Label;
    private skillType: eui.Image;

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    public onLongTouch(){

    }

    public onClick(){
       this.dispatchEventWith('choose_card',this.data)
    }

    public dataChanged(){
        var vo:any = this.data
        this.img.source = vo.getImage();
        this.bg.source = vo.getBG();
        if(vo.isMonster)
        {
            this.skillType.visible = false
            this.spaceGroup.visible = true
            this.spaceText.text = vo.space + '';
        }
        else
        {
            this.skillType.visible = true
            this.spaceGroup.visible = false
            this.skillType.source = vo.getTypeIcon();
        }

        this.costText.text = vo.cost;


        var useNum = vo.temp[vo.id] || 0;
        this.nameText.text = vo.name + '('+(3-useNum)+')';
        this.touchChildren = this.touchEnabled = useNum < 3
    }
}