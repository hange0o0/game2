class BasePosHeroChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BasePosHeroChooseItemSkin";
    }


    private bg: eui.Image;
    private removePosText: eui.Label;
    private nameText: eui.Label;
    private mc: eui.Image;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private posText: eui.Label;




    public stopDrag;
    public stopMove = true;
    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
        //this.addBtnEvent(this,this.onClick)
    }

    private onLongTouch(){
        if(!this.data.id)
            return;
        HeroInfoUI.getInstance().show(CM.getCardVO(this.data.id))
    }

    private onClick(){

    }

    public dataChanged(){
        if(this.data.remove)
        {
            this.currentState = 'remove'
            this.removePosText.text = this.data.remove
            return;
        }
        if(this.data.pos)
        {
            this.currentState = 'choose'
            this.posText.text = this.data.pos;
        }
        else
            this.currentState = 'normal'



        var vo:any = CM.getCardVO(this.data.id);
        var lv = HeroManager.getInstance().getHeroLevel(this.data.id)
        this.mc.source = vo.getImage();
        this.bg.source = vo.getHeroBG(lv)
        this.nameText.text = vo.name

        for(var i=0;i<5;i++)
            this['s' + i].source = lv>i?'start1_png':'start2_png'
    }

}