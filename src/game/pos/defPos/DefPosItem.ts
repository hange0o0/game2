class DefPosItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "DefPosItemSkin";
    }

    private cdText: eui.Label;
    private deleteBtn: eui.Button;
    private splitBtn: eui.Button;
    private mergeBtn: eui.Image;
    private posBG: eui.Image;
    private cardItem: CardItem;
    private group: eui.Group;
    private c0: DefPosItem2;
    private c1: DefPosItem2;
    private c2: DefPosItem2;
    private c3: DefPosItem2;


    private tw1
    private tw2
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.splitBtn,this.onSplit)
        this.addBtnEvent(this.mergeBtn,this.onMerge)
        this.addBtnEvent(this.group,this.onGroup)

        this.cardItem.touchChildren = this.cardItem.touchEnabled = false;
        this.group.touchChildren = false;

        var tw = this.tw1 =  egret.Tween.get(this.cardItem,{loop:true});
        this.cardItem.y = 90;
        tw.to({y:70},1000,egret.Ease.sineInOut).to({y:90},1000,egret.Ease.sineInOut)

        var tw = this.tw2 = egret.Tween.get(this.group,{loop:true});
        this.group.y = 90;
        tw.to({y:70},1000,egret.Ease.sineInOut).to({y:90},1000,egret.Ease.sineInOut)
    }

    private onGroup(){

    }

    private onDelete(){
        DefPosUI.getInstance().deleteItem(this.data)
    }

    private onSplit(){
        DefPosUI.getInstance().splitItem(this.data)
    }

    private onMerge(){
        DefPosUI.getInstance().mergeItem(this.data)
    }

    public dataChanged(){
        var ids = this.data.ids;
        this.onRemove();
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this)

        if(ids.length == 1 && ids[0] < 0)
        {
            this.deleteBtn.visible = true
            this.splitBtn.visible = false
            this.cardItem.visible = false;
            this.group.visible = false;
            this.cdText.text = (-ids[0]) + ''
            this.mergeBtn.visible = this.data.preLen == 5;
        }
        else
        {
            var haveSkill = false
            if(ids.length == 1)
            {

                this.deleteBtn.visible = true
                this.splitBtn.visible = false

                this.cardItem.visible = true;
                this.group.visible = false;
                this.cardItem.data = CM.getCardVO(ids[0]);

                haveSkill =  !this.cardItem.data.isMonster
                this.tw1.setPaused(false);


            }
            else
            {
                this.deleteBtn.visible = false
                this.splitBtn.visible = true

                this.cardItem.visible = false;
                this.group.visible = true;
                this.group.removeChildren();
                for(var i=0;i<ids.length;i++)
                {
                    var item = this['c' + i];
                    this.group.addChild(item);
                    item.data = ids[i];
                    if(!CM.getCardVO(item.data).isMonster)
                        haveSkill = true;
                }

                this.tw2.setPaused(false);

            }

            if(haveSkill)
                this.posBG.source = 'pos2_png'
            else
                this.posBG.source = 'pos1_png'

            var cd = Math.round(this.data.cd/1000)
            if(cd <= 60)
            {
                this.cdText.text = MyTool.toFixed(cd,1) + 's'
            }
            else
            {
                this.cdText.text = Math.floor(cd/60) + 'm ' +(cd%60) + 's'
            }
            this.mergeBtn.visible = ids.length + this.data.preLen <= 4;
        }





    }

    private onRemove(){
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemove,this)
        this.tw1.setPaused(true);
        this.tw2.setPaused(true);
    }

}