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
        TecInfoUI.getInstance().show();
    }

    public dataChanged(){
         this.levelText.text = 'LV.12'
         this.nameText.text = 'XXXXX'
        this.redMC.visible = false;
        this.mc.source = Config.localResRoot + 'head/m_head'+1+'.jpg';
    }

}