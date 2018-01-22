class SlaveItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "SlaveItemSkin";
    }

    private getAllBtn: eui.Button;
    private lockText: eui.Label;
    private nameText: eui.Label;
    private coinText: eui.Label;
    private type: eui.Image;
    private getBtn: eui.Button;
    private cdText: eui.Label;
    private redMC: eui.Image;
    private clickArea: eui.Group;






    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        this.addBtnEvent(this.getBtn,this.onGet)
        this.addBtnEvent(this.getAllBtn,this.onGetAllClick)
        this.addBtnEvent(this.clickArea,this.onInfo)
    }

    private onClick(){
        if(this.data.empty)
        {
            SlaveChooseUI.getInstance().show()
        }
        else if(this.data.lock)
        {

        }
    }
    private onInfo(){
        OtherInfoUI.getInstance().show(this.data.gameid);
    }
    private onGet(e){

    }
    private onGetAllClick(e){

    }

    public onTimer(){
         if(this.currentState == 'normal')
         {
             var cd = Math.min(3600*8,10)
             this.cdText.text = DateUtil.getStringBySecond(cd);
             MyTool.changeGray(this.getBtn,cd < 60*60,true)
             this.redMC.visible = cd == 3600*8;
         }
    }

    public dataChanged(){
        if(this.data.empty)
        {
            this.currentState = 'empty'
        }
        else if(this.data.lock)
        {
            this.currentState = 'lock'
            this.lockText.text = '主城等级10开启'
        }
        else if(this.data.btn)
        {
            this.currentState = 'btn'
        }
        else
        {
            this.currentState = 'normal'
            this.nameText.text = ''
            this.coinText.text = ''
            //this.type.source = ''
        }
    }

}