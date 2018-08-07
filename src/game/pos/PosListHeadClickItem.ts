class PosListHeadClickItem extends PosListHeadItem {
    public constructor() {
        super();
    }
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick() {
        var vo = CM.getCardVO(this.data);
        if(vo)
            CardInfoUI.getInstance().show(vo);
    }
}