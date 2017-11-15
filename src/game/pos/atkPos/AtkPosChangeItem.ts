class AtkPosChangeItem extends AtkPosItem {
    public constructor() {
        super();
    }

    public stopDrag;
    public stopMove = true;
    public childrenCreated() {
        super.childrenCreated();
        DragManager.getInstance().setDrag(this,true);


        //this.addBtnEvent(this,this.onClick)
    }
    private renewSelect(data){
        this.selectMC.visible = data == this.data;
    }

}