class PKPosItem extends game.BaseItem {

    private posBG: eui.Image;
    private carGroup: eui.Group;
    private bg: eui.Image;
    private img: eui.Image;
    private timesBG: eui.Image;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private timesText: eui.Label;
    private barGroup1: eui.Group;
    private barMC1: eui.Image;
    private barGroup2: eui.Group;
    private barMC2: eui.Image;



    public index;
    public tw;
    public constructor() {
        super();

        this.skinName = "PKPosItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();


        var tw = this.tw = egret.Tween.get(this.carGroup,{loop:true});
        this.carGroup.y = 5;
        tw.to({y:-15},1000,egret.Ease.sineInOut).to({y:5},1000,egret.Ease.sineInOut)
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
        this.scaleX = this.scaleY = b?1.1:1        //@
        if(b)
            this.parent.addChild(this);
    }

    public onRemove(){
        this.tw.setPaused(true);
    }


    private onTimer(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index];
        var preData:PKPosCardData = PKData.getInstance().myPlayer.prePosCard[this.index];
        this.barGroup1.visible = false;
        this.barGroup2.visible = false;
        this.carGroup.visible = false;
        this.tw.setPaused(true);
        var barWidth = 204
        if(data && data.useEnable())
        {
            var cd = data.getNextCD();
            var maxCD = data.getMaxCD();
            if(data.useEnable())
            {
                var vo:any = CM.getCardVO(data.mid)
                this.img.source = vo.getImage();
                this.bg.source = vo.getBG();

                if(vo.isMonster)
                {
                    this.spaceGroup.visible = true
                    this.spaceText.text = vo.space + '';
                    this.posBG.source = 'pos1_png'

                }
                else
                {
                    this.spaceGroup.visible = false
                    this.posBG.source = 'pos2_png'
                }

                this.tw.setPaused(false);
                this.barGroup1.visible = true;
                this.barMC1.width = barWidth * cd / maxCD;

                var maxNum = data.getMaxNum();
                this.timesText.text = maxNum - data.num
                this.timesBG.visible = maxNum > 0
            }
        }
        else if(preData)
        {
            var vo:any = CM.getCardVO(preData.mid)
            this.img.source = vo.getImage();
            this.bg.source = vo.getBG();
        }

        if(preData)
        {
            this.barGroup2.visible = true;
            this.barMC2.width = barWidth * cd / maxCD;
        }
    }
}
