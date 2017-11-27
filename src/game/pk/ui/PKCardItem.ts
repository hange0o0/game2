class PKCardItem extends game.BaseItem {

    //private desText: eui.Label;
    private bg: eui.Image;
    private img: eui.Image;
    private spaceGroup: eui.Group;
    private spaceText: eui.Label;
    private costText: eui.Label;
    private skillType: eui.Image;




    public con:PKCtrlCon;


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

    }

    private onClick(){
        if(this.data)
            this.con.setChooseCard(this);
    }


    public dataChanged(){
        if(!this.data)
        {
            this.y = 20;
            this.currentState = 'empty'     //@
            return;
        }
        this.currentState = 'normal'
        var vo:any = CM.getCardVO(this.data.mid)
        this.img.source = vo.getImage();
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
        if(nowMp < mp)
            this.costText.textColor = 0xFF0000
        else
            this.costText.textColor = 0xFFFFFF
    }

    public renewChoose(){
        if(this.isDragMC)
            return;
        this.y = this == this.con.chooseCard?-10:20;
    }
}




