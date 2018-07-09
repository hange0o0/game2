class BasePosChooseItem extends BasePosItem {
    public constructor() {
        super();
    }


    public childrenCreated() {
        super.childrenCreated();
        DragManager.getInstance().setDrag(this,true);
    }

    public renewSelect(selectData,swapData){
        this.alpha = selectData == this.data?0.5:1
        this.selectMC.visible = swapData == this.data;
    }

}