class PosCardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "CardItemSkin";
    }

    private des: eui.Label;
    private nameText: eui.Label;
    private spaceText: eui.Label;
    private costText: eui.Label;

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    public onLongTouch(){

    }

    public onClick(){
       this.dispatchEventWith('choose_card',this.data)
    }

    public dataChanged(){
        this.des.text = this.data.id;
        this.costText.text = this.data.cost;
        this.spaceText.text = this.data.space || '';

        var useNum = this.data.temp[this.data.id] || 0;
        this.nameText.text = this.data.name + '('+(3-useNum)+')';
        this.touchChildren = this.touchEnabled = useNum < 3
    }
}