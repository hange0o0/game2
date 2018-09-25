class TecInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TecInfoItemSkin";
    }

    private redMC: eui.Rect;
    private nameText: eui.Label;
    private numText: eui.Label;
    private img: eui.Image;
    private ownGroup: eui.Group;
    private ownText: eui.Label;




    private stageX
    private stageY

    public childrenCreated() {
        super.childrenCreated();
        MyTool.addLongTouch(this,this.onLongTouch,this)
    }

    private onLongTouch(){
        this.ownGroup.visible = true
        GameManager.stage.once(egret.TouchEvent.TOUCH_END,this.hide,this,true);
        GameManager.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onMove,this);
        this.stageX = GameManager.stageX
        this.stageY = GameManager.stageY
    }
    private onMove(e){
        if(Math.abs(this.stageX - e.stageX) > 20 || Math.abs(this.stageY - e.stageY) > 20)
            this.hide();
    }

    private hide(){
        this.ownGroup.visible = false
    }


    public dataChanged(){
        var isRed = 1
        var total
        if(this.data.type == 'coin')
        {
            this.nameText.text = '金币'
            this.numText.text = '×'+NumberUtil.addNumSeparator(this.data.num)
            total = Math.max(0,UM.getCoin());
            this.img.source = MyTool.getPropCoin();
        }
        else if(this.data.type == 'lv')
        {
            this.nameText.text = '科技等级  '
            this.numText.text = 'LV.' + this.data.num+''
            total = TecManager.getInstance().getLevel(1);
            this.img.source = MyTool.getPropLevel();
        }
        else if(this.data.type == 'hang')
        {
            this.nameText.text = '战役等级  '
            this.numText.text = 'LV.' + this.data.num+''
            total = HangManager.getInstance().level;
            this.img.source = MyTool.getPropHang();
        }
        else
        {
            var vo = PropVO.getObject(this.data.id);
            this.img.source = vo.getThumb();
            this.nameText.text = vo.propname
            this.numText.text =  ' ×' + NumberUtil.addNumSeparator(this.data.num)
            total = PropManager.getInstance().getNum(this.data.id);
        }

        isRed =  total/this.data.num;
        if(this.data.type == 'lv')
            this.ownText.text = '当前等级：' + total;
        else
            this.ownText.text = '当前拥有：' + total;

        this.numText.textColor = isRed<1?0xFF0000:0xFCDB79;
        if(isRed<1)
        {
            this.redMC.width = isRed*(this.width - 10)
            this.redMC.fillColor = 0xFF0000
        }
        else
        {
            this.redMC.width = 1/isRed*(this.width - 10)
            this.redMC.fillColor = 0x00FF00
        }

        this.ownGroup.visible = false

    }

}