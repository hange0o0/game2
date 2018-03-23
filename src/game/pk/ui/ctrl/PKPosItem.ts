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

    private group: eui.Group;
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
    }


    public remove(){
        egret.Tween.removeTweens(this.group);
        MyTool.removeMC(this);
    }


    private onTimer(){
        var data:PKPosCardData = this.data;
        var barWidth = 204

        var cd = data.getNextCD();
        var maxCD = data.getMaxCD();

        if(data.num && data.mid > PKConfig.skillBeginID)
        {
            cd = data.getRemainCD();
            maxCD = maxCD * Math.max(1,data.getMaxNum()-1);
        }

        if(data.mid < PKConfig.skillBeginID)
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
    private renewImg(mid){
        var vo:any = CM.getCardVO(mid)
        this.img.data = vo.id;
        this.bg.source = vo.getBG();
    }

    public mvAdd(){
        egret.Tween.removeTweens(this.group);
        this.group.scaleX = this.group.scaleY = 0
         var tw = egret.Tween.get(this.group);
        tw.to({scaleX:1.2,scaleY:1.2},200).to({scaleX:1,scaleY:1},200)
    }

    public mvRemove(fun){
        egret.Tween.removeTweens(this.group);
        this.group.scaleX = this.group.scaleY = 1
        var tw = egret.Tween.get(this.group);
        tw.to({scaleX:1.2,scaleY:1.2},200).wait(100).to({scaleX:0,scaleY:0},200).call(fun)
    }
}
