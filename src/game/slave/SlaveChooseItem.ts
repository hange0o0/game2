class SlaveChooseItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveChooseItemSkin";
    }

    private headMC: HeadMC;
    private typeMC: eui.Image;
    private nameText: eui.Label;
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
        this.nameText.text = '' + this.data.nick// + "  (LV."+(this.data.level || 1)+")";
        this.coinText.text = '时产：' + this.data.hourcoin + '';
        this.forceText.text = '战力：'  + this.data.tec_force;
        this.headMC.setData(this.data.head,this.data.type);
        MyTool.setTypeImg(this.typeMC,this.data.type)

    }

}