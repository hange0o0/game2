class TecInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecInfoItemSkin";
    }

    private coinText: eui.Label;
    private img: eui.Image;



    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
         this.img.source
        this.coinText.text = '不知名啊啊 ×' + NumberUtil.addNumSeparator(1233534)
        this.coinText.textColor = true?0xFCDB79:0xFF0000
    }

}