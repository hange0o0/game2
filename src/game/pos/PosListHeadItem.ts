class PosListHeadItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosListHeadItemSkin";
    }

    private heroBG: eui.Image;
    private heroImg: eui.Image;
    private s0: eui.Image;
    private s1: eui.Image;
    private s2: eui.Image;
    private s3: eui.Image;
    private s4: eui.Image;
    private bg: eui.Image;
    private img: CardImg;




    public id
    public isHero
    public childrenCreated() {
        super.childrenCreated();
        this.img.hideType = true;
        //this.addBtnEvent(this,this.onClick)
    }


    public dataChanged(){
        //return;
        //var gay = this.data.indexOf('@') == 0;
        //if(gay)
        //    this.data = this.data.substr(1);
        var isHero = false
        if(typeof this.data == 'object')
        {
            var id = this.id = this.data.id;
            isHero = this.data.isHero
            var lv = this.data.lv || 1;
        }
        else
            var id = this.id = this.data;


        var vo:any = CM.getCardVO(id);


        if(vo)
        {
            if(!isHero && vo.isHero())
            {
                isHero = true;
                lv = 1;
            }
            if(isHero)
            {
                this.currentState = 'hero'
                this.heroImg.source = vo.getImage();
                this.heroBG.source = vo.getHeroBG(lv)
                for(var i=0;i<5;i++)
                    this['s' + i].source = lv>i?'start1_png':'start2_png'
            }
            else
            {
                this.img.visible = true
                this.img.data = vo.id;
                this.bg.source = vo.getBG();
                this.currentState = 'normal'
            }

        }
        else
        {
            this.img.visible = false
            this.currentState = 'unknow'
            this.bg.source = 'border_16_png'
        }
        this.isHero = isHero;
    }

    public setGray(b){
        if(this.isHero)
        {
            this.heroBG.source = MonsterVO.getObject(this.id).getHeroBG(b?0:1)
        }
        else
            this.img.changeGay(b)
    }


}