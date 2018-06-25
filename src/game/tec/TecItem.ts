class TecItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecItemSkin";
    }

    private mc: eui.Image;
    private levelText: eui.Label;
    private nameText: eui.Label;
    private redMC: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        TecInfoUI.getInstance().show(this.data);
    }

    public dataChanged(){
         this.levelText.text = 'LV.' + TecManager.getInstance().getLevel(this.data.id)
         this.nameText.text = this.data.name;
        this.redMC.visible = TecManager.getInstance().testRed(this.data.id);
        this.mc.source = this.data.getThumb();


    }

}