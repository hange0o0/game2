class PKTopItem extends game.BaseItem {

    private group: eui.Group;
    private nameText: eui.Label;


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
        this.nameText.text = this.data.mid
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
        var tw = egret.Tween.get(this.group)
        tw.to({alpha:0},500).wait(500).call(function(){
            this.removeAble = true
        },this)
    }

    private onTimer(){

    }
}