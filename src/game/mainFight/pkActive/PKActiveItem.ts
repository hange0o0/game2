class PKActiveItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PKActiveItemSkin";
    }


    private bg: eui.Image;
    private img: eui.Image;
    private nameText: eui.Label;
    private cardMC: CardImg;



    private skillID
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.skillID)
        {
            CardInfoUI.getInstance().show(CM.getCardVO(this.skillID));
            return;
        }
    }

    public dataChanged(){
        this.skillID = 0
        var name = ''
        if(this.data.id == 'coin')
        {
            name = this.createHtml('金币',0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num);
            this.img.source = MyTool.getPropCoin()
        }
        else if(this.data.id == 'energy')
        {
            name = this.createHtml('体力',0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num);
            this.img.source = MyTool.getPropEnergy();
        }
        else if(this.data.id == 'box_resource')
        {
            name = this.createHtml('资源宝箱',0xFFD27F)  + '\nLV.' + (this.data.num) + '';
            this.img.source = MyTool.getPropBox(this.data.num);
        }
        else if(this.data.id == 'box_skill')
        {
            name = this.createHtml('技能宝箱',0xFFD27F)  + '\nLV.' + (this.data.num) + '';
            this.img.source = MyTool.getSkillBox(this.data.num);
        }
        else if(this.data.id == 'box_hero')
        {
            name = this.createHtml('英雄宝箱',0xFFD27F)  + '\nLV.' + (this.data.num) + '';
            this.img.source = MyTool.getHeroBox(this.data.num);
        }
        else if((this.data.id + '').substr(0,5) == 'skill')
        {
            var svo = SkillVO.getObject(this.data.id.substr(5));
            this.skillID = svo.id;
            name = this.createHtml(svo.name,0xFFD27F) + '×' + this.data.num;
            this.currentState = 'card'
            this.cardMC.data = this.skillID
            //console.log(this.cardMC.)
        }
        else
        {
            var vo = PropVO.getObject(this.data.id);
            name = this.createHtml(vo.propname,0xFFD27F) + '\n×' + this.data.num;
            this.img.source = vo.getThumb()

        }
        this.setHtml(this.nameText, name)
    }

}