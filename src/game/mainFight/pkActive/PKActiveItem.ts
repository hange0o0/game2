class PKActiveItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKActiveItemSkin";
    }


    private bg: eui.Image;
    private img: eui.Image;
    private nameText: eui.Label;
    private cardMC: CardImg;
    private heroBG: eui.Image;
    private heroMC: eui.Image;




    private skillID
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.skillID)
        {
            CardInfoUI.getInstance().show(CM.getCardVO(this.skillID));
            return;
        }
        if(this.data.isHero)
        {
            HeroInfoUI.getInstance().show(this.data.vo);
            return;
        }
    }

    public dataChanged(){
        this.skillID = this.data.skillID
        if(this.skillID)
        {
            this.currentState = 'card'
            this.cardMC.data = this.skillID
            this.setHtml(this.nameText, this.createHtml(this.data.name,0xFFD27F)  + '' + this.data.num)
        }
        else if(this.data.isHero)
        {
            this.currentState = 'hero'
            this.heroMC.source = this.data.img;
            this.heroBG.source = this.data.bgSource;
            this.setHtml(this.nameText, this.createHtml(this.data.name.replace('【英雄】',''),0xFFD27F))
        }
        else
        {
            this.currentState = 'prop'
            this.img.source = this.data.img;

            if(this.data.num2)
                this.setHtml(this.nameText, this.createHtml(this.data.name,0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num2))
            else
                this.setHtml(this.nameText, this.createHtml(this.data.name,0xFFD27F)  + '\n' + this.data.num)
        }

    }

}