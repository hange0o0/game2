class PKCardInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKCardInfoItemSkin";
    }

    private icon: eui.Image;
    private text: eui.Label;





    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this,this.onClick)
    }

    private onClick(){

    }

    public dataChanged(){
        var arr = [1,4,5,8]
        if(arr.indexOf(this.data.index) != -1)
            this.currentState = 'stat1'
        else
            this.currentState = 'stat2'
        //{index:1,icon:'icon_cost_png',iconScale:1,title:'费用',value:vo.cost,valueAdd:0},
        this.icon.source = this.data.icon
        this.icon.scaleX = this.icon.scaleY = this.data.iconScale
        if(this.data.title)
        {
            this.setHtml(this.text, this.createHtml(this.data.title,0xffff00) + '：' +  this.data.value
                + (this.data.valueAdd ? this.createHtml(' +'+this.data.valueAdd,0x00ff00) : ''))
        }
        else
            this.text.text = ''

    }

}