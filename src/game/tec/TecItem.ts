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
        if(this.data.id == 1 && TecManager.getInstance().getLevel(this.data.id) >= TecManager.getInstance().maxMainLevel)
        {
            MyWindow.Alert('下一等级暂未开放！')
            return;
        }
        TecInfoUI.getInstance().show(this.data);
    }

    public dataChanged(){
         this.levelText.text = 'LV.' + TecManager.getInstance().getLevel(this.data.id)
         this.nameText.text = this.data.name;
        this.redMC.visible = TecManager.getInstance().testRed(this.data.id);
        this.mc.source = this.data.getThumb();


    }

}