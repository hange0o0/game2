class AtkPosChangeItem extends AtkPosItem {
    public constructor() {
        super();
    }


    public childrenCreated() {
        super.childrenCreated();
        DragManager.getInstance().setDrag(this,true);
    }

    private renewSelect(data){
        this.selectMC.visible = data == this.data;
    }

}