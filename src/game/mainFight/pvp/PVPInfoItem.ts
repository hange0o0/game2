class PVPInfoItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PvpInfoItemSkin";
    }

    private icon: eui.Image;
    private desText: eui.Label;
    private awardMC: eui.Image;
    private boxBtn: eui.Group;
    private boxMC: eui.Image;
    private boxText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.boxBtn,this.onClick)
    }

    private onClick(){
        if(this.data.current < this.data.num)
            return;
        PVPManager.getInstance().getAward(this.data.index);
    }

    public dataChanged(){

        this.boxBtn.visible = false
        this.awardMC.visible = false
        this.icon.source = 'pvp_task_2_png'
        var str = ''
        switch(this.data.type)
        {
            case 0:
                str = '完成今天的所有任务'
                this.icon.source = 'pvp_task_1_png'
                break;
            case 1:
                str = '在竞技场中进行'+this.data.num+'场比赛'
                break;
            case 2:
                str = '在竞技场中获得'+this.data.num+'场胜利'
                break;
            case 3:
                str = '在对决中使用【'+MonsterVO.getObject(this.data.mid).name+'】卡牌'+this.data.num+'次'
                break;
            case 4:
                str = '在对决中使用10费及以上卡牌'+this.data.num+'次'
                break;
            case 5:
                str = '在对决中使用5费及以下卡牌'+this.data.num+'次'
                break;
        }
        this.data.current = Math.min(this.data.current,this.data.num)
        var isFinish = this.data.current >= this.data.num
        if(isFinish)
            this.setHtml(this.desText, str + '\n' +this.createHtml( '任务进度：',0xFF9811) + this.createHtml(''+this.data.current+'/'+this.data.num+'',0xFFC16D))
        else
            this.setHtml(this.desText, str + '\n' +this.createHtml( '任务进度：',0xFF9811) + this.createHtml(''+this.data.current+'/'+this.data.num+'',0xFF6D6D))

        if(this.data.award)
            this.awardMC.visible = true;
        else
        {
            this.boxBtn.visible = true
            MyTool.changeGray(this.boxMC,this.data.current < this.data.num)
            this.boxMC.source = MyTool.getPropBox(this.data.box)
            this.boxText.text = 'lv.' + this.data.box
        }

    }
}