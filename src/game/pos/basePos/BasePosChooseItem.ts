class BasePosChangeItem extends BasePosItem {
    public constructor() {
        super();
    }


    public childrenCreated() {
        super.childrenCreated();
        DragManager.getInstance().setDrag(this,true);
    }

    private renewSelect(datas){
        var b = false
        for(var i=0;i<datas.length;i++)
        {
             if(datas[i] == this.data)
             {
                 b = true;
                 break;
             }
        }
        this.selectMC.visible = b;
    }

}