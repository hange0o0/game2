class PKMasterInfoUI extends game.BaseWindow {
    private static instance:PKMasterInfoUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKMasterInfoUI();
        return this.instance;
    }

    public constructor() {
        super();
        this.skinName = "PKMasterInfoUISkin";
    }

    private desText: eui.Label;
    private backBtn: eui.Button;
    private okBtn: eui.Button;
    private headMC: HeadMC;
    private typeMC: eui.Image;
    private nameText: eui.Label;
    private coinText: eui.Label;
    private forceText: eui.Label;





    private masterData
    private gameid

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.backBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onPK);

    }

    public onPK(){
        var self = this;
        PKBeforeUI.getInstance().show({
            fun:function(id){
                SlaveManager.getInstance().slave_pk_begin(self.gameid,self.masterData.gameid,id)
                self.hide();
            }
        })
    }



    public show(masterData?,gameid?){
        this.masterData = masterData
        this.gameid = gameid
        super.show();
    }

    public onShow(){
        this.nameText.text = '' + this.masterData.nick// + "  (LV."+(this.data.level || 1)+")";
        this.coinText.text = '时产：' + this.masterData.hourcoin;
        this.forceText.text = '战力：'  + this.masterData.tec_force;
        this.headMC.setData(this.masterData.head,this.masterData.type);
        MyTool.setTypeImg(this.typeMC,this.masterData.type)

        var arr = [
            '想抢我奴隶？先打赢了我再说吧！',
            '这个奴隶是我的，谁也不能抢走！',
            '这个奴隶我也不想要了，但也不是你说要就给的吧？',
            '来跟我大战30回合，赢了奴隶就送你好了！',
            '不能保护好我的小弟，我这个做大哥的颜面何存！',
            '先打一架再说！',
            '光天化日之下强抢奴隶，还有王法吗！',
            '什么阿猫阿狗也来抢我奴隶吗？',
            '哈哈，就凭你，也想来抢我的奴隶？',
            '要不你也留下做我的奴隶？',
            '嗯？胆子不小嘛~',
            '我不能眼睁睁地看着我的奴隶明珠暗投！',
            '你还是走吧，我不想多做杀孽。',
            '已经很久没有人敢来跟我抢奴隶了。。。',
        ]
        this.desText.text = ArrayUtil.randomOne(arr);
        this.desText.textAlign = this.desText.numLines == 1?"center":'left'
    }
}