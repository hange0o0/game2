class PKPosItem extends game.BaseItem {

    private con: eui.Group;
    private lightBG: eui.Image;
    private posBG: eui.Image;
    private indexText: eui.Label;
    private cardGroup: eui.Group;
    private bg: eui.Image;
    private img: CardImg;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private timesBG: eui.Image;
    private timesText: eui.Label;
    private failMC: eui.Rect;
    private addIcon: eui.Image;
    private barGroup1: eui.Group;
    private barMC1: eui.Image;
    private barGroup2: eui.Group;
    private barMC2: eui.Image;






    public index;
    public defaultY;
    public tw;
    //public twRemain;
    public constructor() {
        super();

        this.skinName = "PKPosItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();


        var tw = this.tw = egret.Tween.get(this.lightBG,{loop:true});
        this.lightBG.scaleX = this.lightBG.scaleY = 1.1;
        tw.to({scaleX:1.3,scaleY:1.3},500,egret.Ease.sineInOut).to({scaleX:1.1,scaleY:1.1},500,egret.Ease.sineInOut)
        this.tw.setPaused(true)






        MyTool.addLongTouch(this,this.onLongTouch,this)
        this.lightBG.visible = false;
        this.failMC.visible = false
        this.defaultY = this.con.y;
    }

    private onLongTouch(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index] || PKData.getInstance().myPlayer.prePosCard[this.index]
        if(!data)
            return;
        var player = PKData.getInstance().myPlayer
        PKCardInfoUI.getInstance().show({
            mid:data.mid,
            force:player.force,
            type:player.type,
            pos:data.id,
            rota:player.teamData.atkRota,
            teamDef:player.teamData.getTeamDef()
        })
    }


    public dataChanged(){
        this.indexText.text = this.index + ''
        switch(this.index)
        {
            case 1:
                this.addIcon.source = 'icon_atk_png'
                this.addIcon.scaleX = this.addIcon.scaleY = 1.2
                //this.addText.text = '攻击 +10%'
                break;
            case 2:
                this.addIcon.source = 'icon_love_png'
                this.addIcon.scaleX = this.addIcon.scaleY = 0.5
                //this.addText.text = '血量 +10%'
                break;
            case 3:
                this.addIcon.source = 'icon_def1_png'
                this.addIcon.scaleX = this.addIcon.scaleY = 0.4
                //this.addText.text = '间隔 +10%'
                break;
            case 4:
                this.addIcon.visible = false
                //this.addText.text = ''
                break;
        }
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

    public showFail(){
        this.failMC.visible = true
        this.failMC.alpha = 0
        var tw = egret.Tween.get(this.failMC);
        tw.to({alpha:0.3},100).to({alpha:0},100).to({alpha:0.3},100).to({alpha:0},100).call(function(){
            this.failMC.visible = false
        },this)
    }

    public setOver(b)
    {
        this.con.y = b?this.defaultY-30:this.defaultY
        if(b)
            this.parent.addChild(this);
    }

    public onRemove(){
        //egret.Tween.removeTweens(this.barGroup1)
        egret.Tween.removeTweens(this.failMC)
        //this.barGroup1.alpha = 1;
        //this.twRemain = null;
        this.failMC.visible = false
        this.lightBG.visible = false
        //this.tw.setPaused(true);
    }


    private onTimer(){
        var data:PKPosCardData = PKData.getInstance().myPlayer.posCard[this.index];
        var preData:PKPosCardData = PKData.getInstance().myPlayer.prePosCard[this.index];
        this.barGroup1.visible = false;
        this.barGroup2.visible = false;
        this.barGroup2.y = 195;
        this.cardGroup.visible = false;
        var barWidth = 204
        if(data && data.useEnable())
        {
            var cd = data.getNextCD();
            var maxCD = data.getMaxCD();

            this.renewImg(data.mid);
            this.barGroup1.visible = true;
            this.barMC1.width = barWidth * cd / maxCD;

            var maxNum = data.getMaxNum();
            this.timesText.text = (maxNum - data.num) + ''
            this.timesBG.visible = maxNum > 0
            this.barGroup2.y = 215;
            if((maxNum - data.num) <=1)
                this.testTween(cd)
            else if(data.actionResult)
                this.testTween(0)
            else
                this.testTween()

            //if(data.actionResult)
            //{
            //    if(!this.twRemain)
            //    {
            //        this.barGroup1.alpha = 1;
            //        var tw = this.twRemain = egret.Tween.get(this.barGroup1,{loop:true});
            //        tw.to({alpha:0.2},500,egret.Ease.sineInOut).to({alpha:1},500,egret.Ease.sineInOut)
            //    }
            //}
            //else if(this.twRemain)
            //{
            //     egret.Tween.removeTweens(this.barGroup1)
            //    this.barGroup1.alpha = 1;
            //    this.twRemain = null;
            //}
        }
        else if(preData)
        {
            this.testTween();
            this.renewImg(preData.mid);

            var maxNum = preData.getMaxNum();
            this.timesText.text = (maxNum - preData.num) + ''
            this.timesBG.visible = maxNum > 0
        }
        else
        {
             this.testTween();
        }

        if(preData)
        {
            this.barGroup2.visible = true;
            var cd = preData.getNextCD();
            var maxCD = preData.getMaxCD();
            this.barMC2.width = barWidth * cd / maxCD;


        }
    }

    private testTween(cd=99999){

        if(cd>5000)
        {
            this.tw.setPaused(true)
            this.lightBG.visible = false;
        }
        else
        {
            this.tw.setPaused(false)
            this.lightBG.visible = true;
            if(cd<=0)
                this.lightBG.source = 'card_back_bg_light1_png'
            else
                this.lightBG.source = 'card_back_bg_light2_png'
        }
    }

    private renewImg(mid){
        var vo:any = CM.getCardVO(mid)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
        this.cardGroup.visible = true;

        this.spaceGroup.visible = false
        //if(vo.isMonster)
        //{
        //    this.spaceGroup.visible = true
        //    this.spaceText.text = vo.space + '';
        //}
        //else
        //{
        //    this.spaceGroup.visible = false
        //}

    }
}
