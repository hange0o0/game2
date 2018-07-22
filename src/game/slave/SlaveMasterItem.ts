class SlaveMasterItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveMasterItemSkin";
    }

    private headMC: HeadMC;
    private forceText: eui.Label;
    private clickArea: eui.Group;
    private nameText: eui.Label;
    private getBtn: eui.Button;
    private cdGroup: eui.Group;
    private cdText: eui.Label;
    private coinText: eui.Label;
    private addFightText: eui.Label;
    private typeMC: eui.Image;







    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.getBtn,this.onPK)
        this.addBtnEvent(this.clickArea,this.onClick)
    }

    private onPK(){
        if(this.cdGroup.visible)
        {
            MyWindow.ShowTips('镇压时间内，无法反抗')
            return;
        }
        var gameid = this.data.gameid
        var master = this.data.master
        PKBeforeUI.getInstance().show({
            fun:function(id){

                SlaveManager.getInstance().slave_pk_begin(UM.gameid,gameid,id)
            }
        })
    }

    private onClick(){
        OtherInfoUI.getInstance().show(this.data.gameid);
    }

    public onTimer(){
        var cd = SlaveManager.getInstance().protime - TM.now()
        if(cd > 0)
        {
            this.cdText.text = DateUtil.getStringBySecond(cd);
            this.cdGroup.visible = true;
            this.getBtn.skinName = 'Btn2Skin';
        }
        else
        {
            this.cdGroup.visible = false;
            this.getBtn.skinName = 'Btn1Skin';
        }
    }

    public dataChanged(){
        this.forceText.text = ''  + this.data.tec_force;
        this.nameText.text = '' + this.data.nick;
        this.coinText.text = '' + NumberUtil.formatStrNum(Math.ceil(UM.hourcoin*0.2)) + '/小时'
        if(this.data.tec_force > UM.tec_force)
            this.addFightText.text =  '+' + Math.ceil((this.data.tec_force - UM.tec_force)*0.05)
        else
            this.addFightText.text =  '无加成'
        this.headMC.setData(this.data.head,this.data.type);
        MyTool.setTypeImg(this.typeMC,this.data.type)
        this.onTimer();
    }

}