class PKAddState extends game.BaseItem {

    private stateMC: eui.Image;
    private arrowMC: eui.Image;

    public isShowing = false
    public list = [];
    public constructor() {
        super();

        this.skinName = "PKAddStateSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged(){
    }

    public remove(){
        this.isShowing = false;
        this.visible = false;
        egret.Tween.removeTweens(this)
        egret.Tween.removeTweens(this.arrowMC)
        this.list.length = 0;
    }

    public showNext(){
        var oo = this.list.shift();
        if(oo)
        {
            this.showState(oo.key,oo.type);
        }
    }

    public showState(key,type){
        if(this.isShowing)
        {
            this.list.push({
                key:key,
                type:type,
            })
            return;
        }
        this.isShowing = true;
        this.visible = true;
        egret.Tween.removeTweens(this)
        egret.Tween.removeTweens(this.arrowMC)
        this.alpha = 0;
        var tw = egret.Tween.get(this)
        tw.to({alpha:1},200).wait(1000).to({alpha:0},200).call(function(){
            this.visible = false;
            this.isShowing = false;
            this.showNext();
        },this)

        this.arrowMC.alpha = 0;
        switch(key)
        {
            case 'atk':
                this.stateMC.source = 'icon_atk_png';
                break;
            case 'def':
                this.stateMC.source = 'icon_def1_png';
                break;
            case 'hp':
                this.stateMC.source = 'icon_love_png';
                break;
            case 'speed':
                this.stateMC.source = 'icon_speed_png';
                break;
            case 'momian':
                this.stateMC.source = 'icon_def2_png';
                break;
            case 'change':
                this.stateMC.source = 'change_icon_png';
                break;
        }

        if(type == 0)//只是图标
        {
            this.stateMC.x = 10
            return
        }
        this.stateMC.x = 0;
        if(type == 1) //增加
        {
            this.arrowMC.y = 20
            this.arrowMC.source = 'arrow5_png'

        }
        else if(type == 2) //减少
        {
            this.arrowMC.y = -20
            this.arrowMC.source = 'arrow4_png'
        }

        var tw = egret.Tween.get(this.arrowMC)
        tw.to({alpha:1,y:0},200).wait(500).to({alpha:0}).wait(50).to({alpha:1}).wait(50).to({alpha:0}).wait(50).to({alpha:1})

    }
}