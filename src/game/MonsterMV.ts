class MonsterMV extends eui.Group {
    public static STAT_RUN = 1
    public static STAT_STAND = 2
    public static STAT_ATK = 3
    public static STAT_DIE = 4

    private mc:eui.Image;


    public frameTotal = 20//播放完一轮需要的帧数

    public state = 2;
    private index = 0;

    private mw = 480/4
    private mh = 480/4

    public vo:MonsterVO;
    constructor(){
        super();
        this.init();
    }

    private init() {
        this.mc = new eui.Image();
        this.addChild(this.mc);
        //
        //MyTool.addTestBlock(this)

    }

    public load(id,isHd?){

        var vo = this.vo = MonsterVO.getObject(id);
        this.mw = vo.mcwidth/vo.mcnum
        this.mh = vo.mcheight/4


        MyTool.setImgSource(this.mc,'enemy' + id + '_png');
        this.width = this.mw
        this.height = this.mh
        this.anchorOffsetX = this.mw/2
        this.anchorOffsetY = this.mh
        this.mc.scrollRect = new egret.Rectangle(0,0,this.mw,this.mh)
    }

    public run(){
        this.state = MonsterMV.STAT_RUN
        this.reset();
    }

    public stand(){
        this.state = MonsterMV.STAT_STAND
        this.reset();
    }

    public die(){
        this.state = MonsterMV.STAT_DIE
        this.reset();
    }

    public atk(){
        this.state = MonsterMV.STAT_ATK
        this.reset();
    }

    public play(){
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public stop(){
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    private reset(){
        this.index = 0;
        this.onE();
    }

    private onE(){
        var w = this.mw
        var h = this.mh
        var frameStep = Math.round(this.frameTotal/this.vo.mcnum);
        //if(this.state == MonsterMV.STAT_ATK)
        //    frameStep = Math.round(frameStep/this.vo.atkspeed);
        var x = Math.floor(this.index/frameStep)*w
        var y = (this.state - 1)*h
        this.mc.scrollRect = new egret.Rectangle(x,y,w,h)
        //console.log(new egret.Rectangle(x,y,w,h))
        //this.stop();
        this.index ++;
        if(this.index>=this.vo.mcnum*frameStep)
        {
            this.index = 0;
            this.onEnd()
        }
    }

    private onEnd(){
        switch(this.state)
        {
            case MonsterMV.STAT_RUN:
                break;
            case MonsterMV.STAT_STAND:
                break;
            case MonsterMV.STAT_ATK:
                this.stand();
                break;
            case MonsterMV.STAT_DIE:
                this.stop();
                this.dispatchEventWith('mv_die')
                break;
        }
    }

}