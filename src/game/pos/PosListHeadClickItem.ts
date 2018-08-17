class PosListHeadClickItem extends PosListHeadItem {
    public constructor() {
        super();
    }
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick() {
        var vo = CM.getCardVO(this.id);
        if(vo)
        {
            if(vo.isHero())
                HeroInfoUI.getInstance().show(vo,this.data);
            else
                CardInfoUI.getInstance().show(vo,this.data);
        }
    }
}