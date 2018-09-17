class BasePosHeroItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BasePosHeroItemSkin";
    }


    private bg: eui.Image;
    private mc: eui.Image;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;

    public stopMove = true;
    public renewSelect(selectData,swapData){
        //this.alpha = selectData == this.data?0.5:1
        //this.selectMC.visible = swapData == this.data;
    }


    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
        DragManager.getInstance().setDrag(this,true);
        //this.addBtnEvent(this,this.onClick)
    }

    private onLongTouch(){
        if(!this.data.id)
            return;
        HeroInfoUI.getInstance().show(CM.getCardVO(this.data.id),BasePosUI.getInstance().cardBaseInfo)
    }

    private onClick(){

    }

    public dataChanged(){
        if(!this.data.id)
        {
            this.currentState = 'empty'
            this.bg.source = 'hero_bg0_png'
            return;
        }

        this.currentState = 'normal'
        var vo:any = CM.getCardVO(this.data.id);
        var lv = HeroManager.getInstance().getHeroLevel(this.data.id)
        this.mc.source = vo.getImage();
        this.bg.source = vo.getHeroBG(lv)

        for(var i=0;i<5;i++)
            this['s' + i].source = lv>i?'start1_png':'start2_png'
    }

}