class DefPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosItemSkin";
    }

    private cdText: eui.Label;
    private deleteBtn: eui.Label;
    private splitBtn: eui.Label;
    private mergeBtn: eui.Rect;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.splitBtn,this.onSplit)
        this.addBtnEvent(this.mergeBtn,this.onMerge)
    }

    private onDelete(){
          DefPosUI.getInstance().deleteItem(this.data)
    }

    private onSplit(){
        DefPosUI.getInstance().splitItem(this.data)
    }

    private onMerge(){
        DefPosUI.getInstance().mergeItem(this.data)
    }

    public dataChanged(){
        var ids = this.data.ids;
        if(ids.length == 1)
        {
             this.deleteBtn.visible = true
             this.splitBtn.visible = false
        }
        else
        {
            this.deleteBtn.visible = false
            this.splitBtn.visible = true
        }

        this.mergeBtn.visible = ids.length + this.data.preLen <= 4;
        var cd = this.data.cd/1000
        if(cd <= 60)
        {
            this.cdText.text = MyTool.toFixed(cd,1) + 's'
        }
        else
        {
            this.cdText.text = Math.floor(cd/60) + 'm ' + MyTool.toFixed(cd%60,1) + 's'
        }
    }

}