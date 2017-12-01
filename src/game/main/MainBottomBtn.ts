class MainBottomBtn extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MainBottomBtnSkin";
    }

    private text: eui.Label;
    private mc: eui.Image;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        this.data.fun()
    }
   public dataChanged(){
        this.text.text = this.data.text
        this.mc.source = this.data.source
    }

}