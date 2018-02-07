class CardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CardItemSkin";
    }

    private bg: eui.Image;
    private img: CardImg;
    private nameText: eui.Label;
    private redMC: eui.Image;
    private costText: eui.Label;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){
        if(this.currentState == 'lock')
            return;
        CardInfoUI.getInstance().show(this.data);
    }

    public dataChanged(){
        var vo:any = this.data
        var isOpen = vo.level <= TecManager.getInstance().getLevel(1);
        var isOwn = CardManager.getInstance().monsterList[this.data.id] || CardManager.getInstance().skillList[this.data.id]
        this.bg.source = vo.getBG();
        this.costText.text = vo.cost;
        this.nameText.text = vo.name;
        this.img.data = vo.id;
        if(isOwn)
        {
            this.currentState = 'normal';
        }
        else if(isOpen)
        {
            this.currentState = 'add';
            this.img.changeGay(true)
        }
        else
        {
            this.currentState = 'lock';
            this.img.changeGay(true)
            this.nameText.text = 'LV.' + vo.level + '解锁'
        }

        //this.skillType.visible = false
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


    }

}