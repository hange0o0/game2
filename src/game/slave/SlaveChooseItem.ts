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
        OtherInfoUI.getInstance().show(this.data.gameid);
    }

    public dataChanged(){
        //{"gameid":"1_10001","nick":"1","type":"1","hourcoin":"0","tec_force":"0","level":"1","master":"","addtime":null,"protime":null,"gettime":null}
        this.nameText.text = '' + this.data.nick;
        this.coinText.text = '产出：' + this.data.hourcoin + '/小时';
        this.forceText.text = '战力：'  + this.data.tec_force;
        this.type.source = 'icon_type' + this.data.type + '_png'
    }

}