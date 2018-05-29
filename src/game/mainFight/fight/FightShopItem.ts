class FightShopItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "FightShopItemSkin";
    }


    private bg: eui.Image;
    private img: eui.Image;
    private nameText: eui.Label;
    private diamondGroup: eui.Group;
    private diamondIcon: eui.Image;
    private diamondText: eui.Label;
    private sellFinish: eui.Label;
    private cardMC: CardImg;


    private skillID
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
        //MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    //private onLongTouch(){
    //    if(!this.skillID)
    //        return;
    //    PKCardInfoUI.getInstance().show({
    //        mid:this.skillID,
    //        force:UM.tec_force,
    //        type:UM.type
    //    })
    //
    //}

    private onClick(){

        //if(game.BaseUI.isStopEevent)
        //    return

        if(this.skillID)
        {
            if(this.data.isbuy)
                CardInfoUI.getInstance().show(CM.getCardVO(this.skillID));
            else
                CardInfoUI.getInstance().show(CM.getCardVO(this.skillID),this.data);
            return;
        }

        if(this.data.isbuy)
            return;

        //if(UM.diamond < this.data.diamond)
        //{
        //    MyWindow.ShowTips('钻石不足！')
        //    return;
        //}
        FightShopBuyUI.getInstance().show(this.data)
        //
        //var str = '确定费'+this.data.diamond+'钻石购买以下道具？\n\n'+this.nameText.text.replace('\n',' ')+''
        //MyWindow.Confirm(str,(b)=>{
        //    if(b==1)
        //    {
        //        PayManager.getInstance().buy_shop(this.data.id,()=>{
        //            MyWindow.ShowTips('购买成功！')
        //            this.dataChanged()
        //        })
        //    }
        //})
    }

    public dataChanged(){
        var name = ''
        this.skillID = 0
        this.currentState = 'prop'
        if(this.data.id == 'coin')
        {
            name = this.createHtml('金币',0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num);
            this.img.source = MyTool.getPropCoin()
        }
        else if(this.data.id == 'energy')
        {
            name = this.createHtml('体力',0xFFD27F)  + '\n×' + NumberUtil.formatStrNum(this.data.num);
            this.img.source = MyTool.getPropEnergy()
        }
        else if((this.data.id + '').substr(0,5) == 'skill')
        {
            var svo = SkillVO.getObject(this.data.id.substr(5));
            this.skillID = svo.id;
            name = this.createHtml(svo.name,0xFFD27F) + '×' + this.data.num;
            this.cardMC.data = this.skillID
            this.currentState = 'card'
        }
        else
        {
            var vo = PropVO.getObject(this.data.id);
            name = this.createHtml(vo.propname,0xFFD27F) + '\n×' + this.data.num;
            this.img.source = vo.getThumb()

        }
        this.setHtml(this.nameText, name)
        if(this.data.isbuy)
        {
            this.sellFinish.visible = true
            this.diamondGroup.visible =  false
            MyTool.changeGray(this.img,true)
        }
        else
        {
            MyTool.changeGray(this.img,false)
            this.sellFinish.visible = false
            this.diamondGroup.visible =  true
            this.diamondText.text = this.data.diamond
            this.diamondText.textColor = (FightManager.getInstance().value < this.data.diamond)?0xFF0000:0xFFFFFF;
        }
    }

}