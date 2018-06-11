class PosCardItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosCardItemSkin";
    }

    private bg: eui.Image;
    private img: CardImg;
    private nameText: eui.Label;
    private costText: eui.Label;
    private numText: eui.Label;
    private skillGroup: eui.Group;
    private skillNumText: eui.Label;





    public stopGay = false;
    //public selectAble = true
    public childrenCreated() {
        super.childrenCreated();

        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    private onLongTouch(){
        if(!this.data.id)
            return;

        PKCardInfoUI.getInstance().show({
            mid:this.data.id,
            force:UM.tec_force,
            type:UM.type
        })

    }

    //public onClick(){
    //   this.dispatchEventWith('choose_card',this.data)
    //}

    public dataChanged(){
        var vo:any = this.data
        this.img.data = vo.id;
        this.bg.source = vo.getBG();

        //this.skillType.visible = false
        //this.spaceGroup.visible = false
        //if(vo.isMonster)
        //{
        //    this.skillType.visible = false
        //    this.spaceGroup.visible = true
        //    this.spaceText.text = vo.space + '';
        //}
        //else
        //{
        //    this.skillType.visible = true
        //    this.spaceGroup.visible = false
        //    this.skillType.source = vo.getTypeIcon();
        //}

        this.costText.text = vo.cost;


        var maxNum = PosManager.getInstance().oneCardNum;
        var useNum = vo.temp[vo.id] || 0;
        this.nameText.text = vo.name
        this.numText.text = (maxNum-useNum) + '/' + maxNum;
        //this.selectAble = useNum < maxNum

        if(!this.stopGay)
            this.img.changeGay((maxNum-useNum) == 0 || BasePosChooseUI.getInstance().isFull)

        if(vo.isMonster)
        {
            this.skillGroup.visible = false
        }
        else
        {
            var num = CardManager.getInstance().getSkillNum(vo.id)
            if(num < CardManager.getInstance().maxSkill)
            {

                this.skillGroup.visible = true
                num -= useNum;
                this.skillNumText.text = num + ''
                if(num <= 0 && !this.stopGay)
                    this.img.changeGay(true)
            }
            else
            {
                this.skillGroup.visible = false
            }

        }
    }
}