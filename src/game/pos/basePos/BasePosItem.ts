class BasePosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BasePosItemSkin";
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
        this.img.hideType = true;
        MyTool.addLongTouch(this,this.onLongTouch,this)
        //this.addBtnEvent(this,this.onClick)
    }

    private onLongTouch(){
        if(!this.data.id)
            return;
        //PKCardInfoUI.getInstance().show({
        //    mid:this.data.id,
        //    force:UM.tec_force,
        //    type:UM.type
        //})
        CardInfoUI.getInstance().show(CM.getCardVO(this.data.id))
    }

    private onClick(){

    }

    public dataChanged(){
        if(this.data.setting)
        {
            this.currentState = 'setting'
            this.stopDrag = true
            return;
        }
        //if(this.data.back)
        //{
        //    this.currentState = 'back'
        //    this.stopDrag = true
        //    return;
        //}
        this.stopDrag = false
        this.currentState = 'normal'
        var vo:any = CM.getCardVO(this.data.id);
        this.img.data = vo.id;
        this.bg.source = vo.getBG();

        this.img.hideType = true;


        this.skillType.visible = false
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
        this.selectMC.visible = false;
    }

}