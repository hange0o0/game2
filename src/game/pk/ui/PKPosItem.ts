class PKPosItem extends game.BaseItem {

    private desText: eui.Label;

    public index;
    public constructor() {
        super();

        this.skinName = "PKPosItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

    }


    public dataChanged(){
        //var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index]
        //if(data)
        //{
        //    this.desText.text = 'id:' + data.mid + '\nnum:' +  data.num
        //}
        //else
        //{
        //    this.desText.text = ''
        //}
    }

    //可以上阵
    public canPos(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index];
        if(!data)
            return true;
        if(data.num > 0 || data.actionResult)
            return true;
        return false;
    }

    private onTimer(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index];
        if(data)
        {
            var cd = data.getNextCD();
            var maxCD = data.getMaxCD();
            if(data.useEnable())
                this.desText.text = 'id:' + data.mid + '\nnum:' +  data.num + '\ncd:' + cd + '/'+maxCD;
            else
                this.desText.text = ''
        }
        else
        {
            this.desText.text = ''
        }


    }
}
