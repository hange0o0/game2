class SlaveChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveChooseItemSkin";
    }

    private nameText: eui.Label;
    private type: eui.Image;
    private coinText: eui.Label;
    private forceText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        OtherInfoUI.getInstance().show();
    }

    public dataChanged(){
        this.nameText.text = ''
        this.coinText.text = ''
        this.forceText.text = ''
        this.type.source = ''
    }

}