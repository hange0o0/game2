class PKCardItem extends game.BaseItem {

    private desText: eui.Label;

    public con:PKCtrlCon;
    public constructor() {
        super();

        this.skinName = "PKCardItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this,this.onClick)

    }

    private onClick(){
        console.log('choose')
        this.con.setChooseCard(this);
    }


    public dataChanged(){
        this.desText.text = 'index:' + this.data.index + '\nmid:' + this.data.mid;
        this.renewChoose();
    }

    //前5张出现时的动画
    public appear(){

    }

    public remove(){
        egret.Tween.removeTweens(this);
        MyTool.removeMC(this);
    }

    public renewChoose(){
        this.y = this == this.con.chooseCard?-10:20;
    }
}




