class AwardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "AwardItemSkin";
    }

    private img: eui.Image;
    private bg: eui.Image;
    private nameText: eui.Label;
    private numText: eui.Label;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick() {
        if(this.data.isHero)
        {
            HeroInfoUI.getInstance().show(this.data.vo)
        }
        else if(this.data.skillID)
        {
            CardInfoUI.getInstance().show(CM.getCardVO(this.data.skillID))
        }
    }

    public dataChanged() {
        this.img.source = this.data.img
        this.nameText.text = this.data.name
        this.numText.text = this.data.num

        if(this.data.isHero)
        {
            this.currentState = 'hero'
            this.bg.source = this.data.bgSource
        }
        else
        {
            this.currentState = 'normal'
            this.bg.source="border2_png"
        }

    }
}