class PKTopItem extends game.BaseItem {

    private group: eui.Group;
    private bg: eui.Image;
    private img: eui.Image;




    public removeAble = false;
    public constructor() {
        super();

        this.skinName = "PKTopItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

    }


    public dataChanged(){
        this.removeAble = false
        this.group.alpha = 1;
        this.alpha = 1;


        if(this.data)
        {
            var vo:any = CM.getCardVO(this.data.mid)
            this.img.source = vo.getImage();
            this.bg.source = vo.getBG();
            this.currentState = 'normal'
        }
        else
            this.currentState = 'empty'

        console.log(111)
        //this.nameText.text = vo.name
    }

    public remove(){
        this.removeAble = true;
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.group);
        MyTool.removeMC(this);
    }

    public appear(){
        var tw = egret.Tween.get(this.group)
        this.group.alpha = 0;
        tw.wait(100).to({alpha:1},500)
    }
    public disAppear(){
        var tw = egret.Tween.get(this)
        tw.to({alpha:0},500).wait(500).call(function(){
            this.removeAble = true
        },this)
    }

    private onTimer(){

    }
}