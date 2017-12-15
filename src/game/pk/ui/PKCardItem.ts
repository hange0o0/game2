class PKCardItem extends game.BaseItem {

    //private desText: eui.Label;
    private bg: eui.Image;
    private img: CardImg;
    private cdBarBg: eui.Rect;
    private cdBar: eui.Rect;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private costText: eui.Label;
    private skillType: eui.Image;







    public con:PKCtrlCon;


    public defaultY = 30
    public isDragMC = false;
    public stopDrag;
    public stopMove = true;
    public constructor() {
        super();

        this.skinName = "PKCardItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this,this.onClick)
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    private onLongTouch(){
        if(!this.data)
            return;
        var player = PKData.getInstance().myPlayer
        PKCardInfoUI.getInstance().show({
            mid:this.data.mid,
            force:CM.getCardVO(this.data.mid).getAdd(player.force,player.type)
        })
        //if(this['longTouchTimer'] && egret.getTimer() - this['longTouchTimer'] < 200)
        //    return;
    }

    private onClick(){
        if(game.BaseUI.isStopEevent)
            return;
        if(this.data)
            this.con.setChooseCard(this);
    }


    public dataChanged(){
        if(!this.data)
        {
            this.stopDrag = true
            this.y = this.defaultY;
            this.currentState = 'empty'
            return;
        }
        this.stopDrag = false
        this.currentState = 'normal'
        var vo:any = CM.getCardVO(this.data.mid)
        this.img.data = this.data.mid;
        this.bg.source = vo.getBG();

        if(vo.isMonster)
        {
            this.skillType.visible = false
            this.spaceGroup.visible = true
            this.spaceText.text = vo.space + '';
        }
        else
        {
            this.skillType.visible = true
            this.spaceGroup.visible = false
            this.skillType.source = vo.getTypeIcon();
        }

        this.costText.text = vo.cost;
        this.renewChoose();
    }

    //前5张出现时的动画
    public appear(){
        var tw = egret.Tween.get(this);
        this.alpha = 0;
        tw.to({alpha:1},200)
    }


    public onMpTest(nowMp){
        if(!this.data)
            return;

        if(this.data.mid < 100)
            var mp = MonsterVO.getObject(this.data.mid).cost
        else
            var mp = SkillVO.getObject(this.data.mid).cost

        var barW = 92
        if(nowMp < mp)
        {
            this.costText.textColor = 0xFF0000
            this.cdBar.visible = true;
            this.cdBarBg.visible = true;
            this.cdBar.height = barW * (mp - nowMp)/mp;
        }
        else
        {
            this.costText.textColor = 0xFFFFFF
            this.cdBar.visible = false;
            this.cdBarBg.visible = false;
        }
    }

    public renewChoose(){
        if(this.isDragMC)
            return;
        this.y = this == this.con.chooseCard?10:this.defaultY;
    }
}




