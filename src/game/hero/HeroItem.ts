class HeroItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HeroItemSkin";
    }

    private bg: eui.Image;
    private nameText: eui.Label;
    private mc: eui.Image;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    public onClick(){
        if(this.currentState == 'lock')
            return;
        HeroInfoUI.getInstance().show(this.data);
    }

    public dataChanged(){
        var vo:MonsterVO = this.data
        var lv = HeroManager.getInstance().getHeroLevel(vo.id);
        var isOwn = lv > 0
        this.bg.source = vo.getHeroBG(lv);
        this.nameText.text = vo.name;
        this.mc.source = vo.getImage();
        if(isOwn)
        {
            this.currentState = 'normal';
            for(var i=0;i<lv;i++)
                this['s' + i].source = lv>i?'start1_png':'start2_png'

        }
        else
        {
            this.currentState = 'lock';
            this.nameText.text = '???'
        }

    }

}