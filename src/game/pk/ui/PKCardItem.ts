class PKCardItem extends game.BaseItem {

    private desText: eui.Label;

    public con:PKCtrlCon;


    public isDragMC = false;
    public stopDrag;
    public stopMove = true;
    public constructor() {
        super();

        this.skinName = "PKCardItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this,this.onClick)

    }

    private onClick(){
        this.con.setChooseCard(this);
    }


    public dataChanged(){
        if(!this.data)
        {
            this.y = 20;
            this.desText.text = ''
            return;
        }
        var mp = MonsterVO.getObject(this.data.mid).cost1
        this.desText.text = 'index:' + this.data.index + '\nmid:' + this.data.mid + '\nmp:' + mp;
        this.renewChoose();
    }

    //前5张出现时的动画
    public appear(){
        var tw = egret.Tween.get(this);
        this.alpha = 0;
        tw.to({alpha:1},200)
    }



    public renewChoose(){
        if(this.isDragMC)
            return;
        this.y = this == this.con.chooseCard?-10:20;
    }
}




