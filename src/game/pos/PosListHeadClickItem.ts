class PosListHeadClickItem extends PosListHeadItem {
    public constructor() {
        super();
    }
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick() {
        CardInfoUI.getInstance().show(CM.getCardVO(this.data));
    }
}