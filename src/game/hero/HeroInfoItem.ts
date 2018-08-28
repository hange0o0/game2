class HeroInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "HeroInfoItemSkin";
    }

    private starMC: eui.Image;
    private desText: eui.Label;




    public justInfo = false;


    public childrenCreated() {
        super.childrenCreated();
    }


    public dataChanged(){
        var vo:HeroSkillVO = this.data.vo;
        this.starMC.source = this.data.heroLevel>= vo.level?'start1_png':'start2_png'
        this.setHtml(this.desText, MyTool.createHtml('【'+vo.name+'】  ',0xFFDE93) + vo.getDes(this.data.forceAdd,true))
    }

}