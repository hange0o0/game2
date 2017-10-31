class PKMonsterInfoItem extends game.BaseItem {

    private nameText: eui.Label;
    private barMC: eui.Rect;

    public constructor() {
        super();

        this.skinName = "PKMonsterInfoItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

    }


    public dataChanged(){
         this.nameText.text = this.data.getVO().name
        this.onTimer();
    }

    public onTimer(){
       this.barMC.width = 76 * this.data.hp/this.data.maxHp;
    }
}
