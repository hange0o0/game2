class AtkPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AtkPosItemSkin";
    }


    public selectMC: eui.Rect;
    private bg: eui.Image;
    private img: CardImg;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private costText: eui.Label;
    private skillType: eui.Image;



    public stopDrag;
    public stopMove = true;
    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        if(this.data.isSetting)
        {
            this.currentState = 'setting'
            return;
        }
        if(this.data.back)
        {
            this.currentState = 'back'
            this.stopDrag = true
            return;
        }
        this.currentState = 'normal'
        var vo:any = CM.getCardVO(this.data.id);
        this.img.data = vo.id;
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
        this.selectMC.visible = false;
    }

}