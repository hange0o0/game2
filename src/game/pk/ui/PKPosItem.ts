class PKPosItem extends game.BaseItem {

    private desText: eui.Label;

    private posBG: eui.Image;
    private carGroup: eui.Group;
    private bg: eui.Image;
    private img: eui.Image;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private timesText: eui.Label;
    private barGroup1: eui.Group;
    private barMC1: eui.Image;
    private barGroup2: eui.Group;
    private barMC2: eui.Image;



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
        var data:PKPosCardData = PKData.getInstance().myPlayer.prePosCard[this.index];
        if(!data)
            return true;
        if(data.num > 0 || data.actionResult)
            return true;
        return false;
    }

    public setOver(b)
    {
        this.desText.scaleX = b?1.1:1
    }


    private onTimer(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index];
        var preData:PKPosCardData = PKData.getInstance().myPlayer.prePosCard[this.index];
        if(data)
        {
            var cd = data.getNextCD();
            var maxCD = data.getMaxCD();
            if(data.useEnable())
            {
                if(data.mid < 100)
                    this.desText.text = 'id:' + data.mid + '\nnum:' +  data.num + '\ncd:' + cd + '\nspace:' + MonsterVO.getObject(data.mid).space;
                else
                    this.desText.text = 'id:' + data.mid + '\nnum:' +  data.num + '\ncd:' + cd;
            }
            else
                this.desText.text = ''
        }
        else
        {
            this.desText.text = ''
        }

        if(preData)
        {
            this.desText.text += '\nready:' + preData.mid
        }
    }
}
