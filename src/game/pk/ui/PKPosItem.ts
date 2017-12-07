class PKPosItem extends game.BaseItem {

    //private posBG: eui.Image;
    private posBG: eui.Image;
    private cardGroup: eui.Group;
    private bg: eui.Image;
    private img: CardImg;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private timesBG: eui.Image;
    private timesText: eui.Label;
    private barGroup1: eui.Group;
    private barMC1: eui.Image;
    private barGroup2: eui.Group;
    private barMC2: eui.Image;





    public index;
    //public tw;
    public constructor() {
        super();

        this.skinName = "PKPosItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();


        //var tw = this.tw = egret.Tween.get(this.cardGroup,{loop:true});
        //this.cardGroup.y = 5;
        //tw.to({y:-15},1000,egret.Ease.sineInOut).to({y:5},1000,egret.Ease.sineInOut)
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
        this.scaleX = this.scaleY = b?1.1:1
        if(b)
            this.parent.addChild(this);
    }

    public onRemove(){
        //this.tw.setPaused(true);
    }


    private onTimer(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index];
        var preData:PKPosCardData = PKData.getInstance().myPlayer.prePosCard[this.index];
        this.barGroup1.visible = false;
        this.barGroup2.visible = false;
        this.barGroup2.y = 160;
        this.cardGroup.visible = false;
        var barWidth = 204
        if(data && data.useEnable())
        {
            var cd = data.getNextCD();
            var maxCD = data.getMaxCD();
            if(data.useEnable())
            {
                this.renewImg(data.mid);
                this.barGroup1.visible = true;
                this.barMC1.width = barWidth * cd / maxCD;

                var maxNum = data.getMaxNum();
                this.timesText.text = (maxNum - data.num) + ''
                this.timesBG.visible = maxNum > 0
                this.barGroup2.y = 180;
            }
        }
        else if(preData)
        {
            this.renewImg(preData.mid);

            var maxNum = preData.getMaxNum();
            this.timesText.text = (maxNum - preData.num) + ''
            this.timesBG.visible = maxNum > 0
        }
        else
        {

        }

        if(preData)
        {
            this.barGroup2.visible = true;
            var cd = preData.getNextCD();
            var maxCD = preData.getMaxCD();
            this.barMC2.width = barWidth * cd / maxCD;


        }
    }

    private renewImg(mid){
        var vo:any = CM.getCardVO(mid)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
        this.cardGroup.visible = true;
        if(vo.isMonster)
        {
            this.spaceGroup.visible = true
            this.spaceText.text = vo.space + '';
        }
        else
        {
            this.spaceGroup.visible = false
        }

    }
}
