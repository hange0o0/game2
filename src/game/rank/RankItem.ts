class RankItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "RankItemSkin";
    }

    private nameText: eui.Label;
    private type: eui.Image;
    private rankText: eui.Label;
    private scoreText: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        OtherInfoUI.getInstance().show(this.data.gameid);
    }

    public dataChanged(){
        this.rankText.text = this.data.index
        this.nameText.text = this.data.nick
        this.type.source = MyTool.getTypeImg(this.data.type);
        this.scoreText.text = this.data.score;
    }

}