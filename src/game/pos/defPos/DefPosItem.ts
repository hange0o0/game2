class DefPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosItemSkin";
    }

    private cdText: eui.Label;
    private deleteBtn: eui.Label;
    private splitBtn: eui.Label;
    private mergeBtn1: eui.Rect;
    private mergeBtn2: eui.Rect;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.splitBtn,this.onSplit)
        this.addBtnEvent(this.mergeBtn1,this.onMergeBtn1)
        this.addBtnEvent(this.mergeBtn2,this.onMergeBtn2)
    }

    private onDelete(){

    }

    private onSplit(){

    }

    private onMergeBtn1(){

    }

    private onMergeBtn2(){

    }

    public dataChanged(){
         this.cdText.text = ''
    }

}