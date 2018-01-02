class PKPosItem extends game.BaseItem {

    private static pool = [];
    public static createItem():PKPosItem{
        var item:PKPosItem = this.pool.pop();
        if(!item)
        {
            item = new PKPosItem();
        }
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        this.pool.push(item);
    }

    private bg: eui.Image;
    private img: CardImg;
    private barGroup: eui.Group;
    private barMC: eui.Image;
    private numGroup: eui.Group;
    private numText: eui.Label;









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


        //var tw = this.tw = egret.Tween.get(this.lightBG,{loop:true});
        //this.lightBG.scaleX = this.lightBG.scaleY = 1.1;
        //tw.to({scaleX:1.3,scaleY:1.3},500,egret.Ease.sineInOut).to({scaleX:1.1,scaleY:1.1},500,egret.Ease.sineInOut)
        //this.tw.setPaused(true)






        MyTool.addLongTouch(this,this.onLongTouch,this)
        //this.lightBG.visible = false;
        //this.failMC.visible = false
        //this.defaultY = this.con.y;
    }

    private onLongTouch(){
        var data:PKPosCardData = this.data
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
        this.renewImg(this.data.mid);
        this.onTimer();
        //this.indexText.text = this.index + ''
        //switch(this.index)
        //{
        //    case 1:
        //        this.addIcon.source = 'icon_atk_png'
        //        this.addIcon.scaleX = this.addIcon.scaleY = 1.2
        //        //this.addText.text = '攻击 +10%'
        //        break;
        //    case 2:
        //        this.addIcon.source = 'icon_love_png'
        //        this.addIcon.scaleX = this.addIcon.scaleY = 0.5
        //        //this.addText.text = '血量 +10%'
        //        break;
        //    case 3:
        //        this.addIcon.source = 'icon_def1_png'
        //        this.addIcon.scaleX = this.addIcon.scaleY = 0.4
        //        //this.addText.text = '间隔 +10%'
        //        break;
        //    case 4:
        //        this.addIcon.visible = false
        //        //this.addText.text = ''
        //        break;
        //}
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
    //public canPos(){
    //    var data:PKPosCardData = PKData.getInstance().myPlayer.prePosCard[this.index];
    //    if(!data)
    //        return true;
    //    if(data.num > 0 || data.actionResult)
    //        return true;
    //    return false;
    //}

    //public showFail(){
    //    this.failMC.visible = true
    //    this.failMC.alpha = 0
    //    var tw = egret.Tween.get(this.failMC);
    //    tw.to({alpha:0.3},100).to({alpha:0},100).to({alpha:0.3},100).to({alpha:0},100).call(function(){
    //        this.failMC.visible = false
    //    },this)
    //}

    //public setOver(b)
    //{
    //    this.con.y = b?this.defaultY-30:this.defaultY
    //    if(b)
    //        this.parent.addChild(this);
    //}

    public remove(){
        MyTool.removeMC(this);
        //egret.Tween.removeTweens(this.barGroup1)
        //egret.Tween.removeTweens(this.failMC)
        //this.barGroup1.alpha = 1;
        //this.twRemain = null;
        //this.failMC.visible = false
        //this.lightBG.visible = false
        //this.tw.setPaused(true);
    }


    private onTimer(){
        var data:PKPosCardData = this.data;
        var barWidth = 204

        var cd = data.getNextCD();
        var maxCD = data.getMaxCD();

        if(data.num && data.mid > 100)
        {
            cd = data.getRemainCD();
            maxCD = maxCD * Math.max(0,data.getMaxNum()-1);
        }

        if(data.mid < 100)
        {
            this.numGroup.visible = true;
            this.numText.text = (data.getMaxNum() - data.num) + '';
        }
        else
        {
            this.numGroup.visible = false;
        }

        if(data.num == 0)
            this.barMC.source = 'bar2_png'
        else
            this.barMC.source = 'bar1_png'

        this.barMC.width = barWidth * (maxCD - cd) / maxCD;


    }

    //private testTween(cd=99999){
    //
    //    if(cd>5000)
    //    {
    //        this.tw.setPaused(true)
    //        this.lightBG.visible = false;
    //    }
    //    else
    //    {
    //        this.tw.setPaused(false)
    //        this.lightBG.visible = true;
    //        //if(cd<=0)
    //        //    this.lightBG.source = 'card_back_bg_light1_png'
    //        //else
    //        this.lightBG.source = 'card_back_bg_light2_png'
    //    }
    //}

    private renewImg(mid){
        var vo:any = CM.getCardVO(mid)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
        //this.cardGroup.visible = true;
        //
        //this.spaceGroup.visible = false
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
