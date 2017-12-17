class PKTopItem extends game.BaseItem {

    private group: eui.Group;
    private bg: eui.Image;
    private img: CardImg;
    private addIcon: eui.Image;
    private indexText: eui.Label;







    public removeAble = false;
    public constructor() {
        super();

        this.skinName = "PKTopItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    private onLongTouch(){
        if(!this.data)
            return;
        var player = this.data.getOwner()
        PKCardInfoUI.getInstance().show({
            mid:this.data.mid,
            force:player.force,
            type:player.type,
            pos:this.data.id,
            rota:player.teamData.atkRota,
            def:player.teamData.getTeamDef()
        })
    }


    public dataChanged(){
        this.removeAble = false
        this.group.alpha = 1;
        this.alpha = 1;


        if(this.data)
        {
            var vo:any = CM.getCardVO(this.data.mid)
            this.img.data = vo.id;
            this.bg.source = vo.getBG();
            this.indexText.text = this.data.topIndex;
            this.currentState = 'normal'

            switch(this.data.id)
            {
                case 1:
                    this.addIcon.source = 'icon_atk_png'
                    this.addIcon.scaleX = this.addIcon.scaleY = 1
                    //this.addText.text = '攻击 +10%'
                    break;
                case 2:
                    this.addIcon.source = 'icon_love_png'
                    this.addIcon.scaleX = this.addIcon.scaleY = 0.4
                    //this.addText.text = '血量 +10%'
                    break;
                case 3:
                    this.addIcon.source = 'icon_def1_png'
                    this.addIcon.scaleX = this.addIcon.scaleY = 0.3
                    //this.addText.text = '间隔 +10%'
                    break;
               default:
                    this.addIcon.visible = false
                    //this.addText.text = ''
                    break;
            }
        }
        else
            this.currentState = 'empty'
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