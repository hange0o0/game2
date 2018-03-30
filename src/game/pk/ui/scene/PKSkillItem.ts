class PKSkillItem extends game.BaseItem {

    private userText: eui.Label;
    private icon: eui.Image;
    private nameText: eui.Label;

    public constructor() {
        super();

        this.skinName = "PKSkillItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        var skillVO = SkillVO.getObject(this.data.mid);
        if(this.data.mid < 500)
            this.setHtml(this.userText, this.createHtml(this.data.getOwner().nick,0xffff00) + '使用');
        else
            this.setHtml(this.userText, this.createHtml(this.data.getOwner().nick,0xffff00) + '触发');

        this.icon.source = skillVO.getTypeIcon()
        this.nameText.text = skillVO.name
        this.nameText.textColor = skillVO.getTypeColor()

        egret.Tween.removeTweens(this);
        this.alpha = 0
        this.height = 40
        var tw = egret.Tween.get(this);
        tw.to({alpha:1},300).wait(1500).to({alpha:0},200).to({height:0},100).call(function(){
            PKTopUI.getInstance().removeSkillItem(this)
        },this);
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this);
    }
}