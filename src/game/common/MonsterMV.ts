class MonsterMV extends eui.Group {
    public static STAT_RUN = 1
    public static STAT_STAND = 2
    public static STAT_ATK = 3
    public static STAT_DIE = 4

    private mc:eui.Image;
    private atkMV:MonsterAtkMV = new MonsterAtkMV();


    public frameTotal = 20//播放完一轮需要的帧数

    public state = 2;
    private index = 0;

    private mw = 480/4
    private mh = 480/4

    public speed = 0;//增加or减少速度百分比
    public runing = false

    public vo:MonsterVO;
    constructor(){
        super();
        this.init();
    }

    private init() {
        this.mc = new eui.Image();
        this.addChild(this.mc);
        this.addChild(this.atkMV);
        this.atkMV.visible = false;
        this.atkMV.addEventListener('mv_end',this.onAtkMVEnd,this)
        //
        //MyTool.addTestBlock(this)

    }

    private onAtkMVEnd(){
        this.atkMV.stop();
        this.atkMV.visible = false
        this.play();
    }

    public load(id,isHd?){

        var vo = this.vo = MonsterVO.getObject(id);
        this.mw = vo.mcwidth/vo.mcnum
        this.mh = vo.mcheight/4

        this.mc.y = vo.heightoff


        MyTool.setImgSource(this.mc,'enemy' + id + '_png');
        this.width = this.mw
        this.height = this.mh
        this.anchorOffsetX = this.mw/2
        this.anchorOffsetY = this.mh
        this.mc.scrollRect = new egret.Rectangle(0,0,this.mw,this.mh)
        this.speed = 0;
    }

    public run(){
        this.state = MonsterMV.STAT_RUN
        //this.state = MonsterMV.STAT_STAND
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
        this.runing = true
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public stop(){
        this.runing = false
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public reset(){
        this.index = 0;
        this.atkMV.visible = false;
        this.atkMV.stop();
        this.onE();
        if(!this.runing)
            this.play();
    }

    public onE(){
        var w = this.mw
        var h = this.mh
        var speed = this.speed || 0;
        if(speed)
        {
            if(speed > 0)
                var frameStep = Math.round(this.frameTotal*(1-speed/(100 + speed))/this.vo.mcnum);
            else
                var frameStep = Math.round(this.frameTotal*(1-speed/100)/this.vo.mcnum);
        }
        else
        {
            var frameStep = Math.round(this.frameTotal/this.vo.mcnum);
        }
        if(this.state == MonsterMV.STAT_ATK && this.vo.id == 99)
            frameStep = 1;
        var x = Math.floor(this.index/frameStep)*w
        var y = (this.state - 1)*h
        this.mc.scrollRect = new egret.Rectangle(x,y,w,h)
        //if(this.vo.id == 78)
        //console.log(x,y,w,h, Math.floor(this.index/frameStep),(this.vo.mcnum))
        //this.stop();

        if(this.state == MonsterMV.STAT_ATK && this.vo.mv_atk2 == 1 && Math.floor(this.index/frameStep)>=(this.vo.mcnum-1))
        {
            this.index = 0;
            this.onEnd()
            return;
        }
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
                if(this.vo.id == 99)
                    this.stand();
                break;
            case MonsterMV.STAT_STAND:
                break;
            case MonsterMV.STAT_ATK:
                if(this.vo.mv_atk2 == 1)
                {
                    this.stop();
                    this.showAtkMV();
                }
                else
                    this.stand();
                break;
            case MonsterMV.STAT_DIE:
                this.stop();
                this.dispatchEventWith('mv_die')
                break;
        }
    }

    private showAtkMV(){
        switch(this.vo.id)
        {
            case 37:
                this.atkMV.visible = true;
                this.atkMV.load(this.vo.id,1,300,240)
                this.atkMV.x = -180
                this.atkMV.y = 55
                this.atkMV.play();
                break;
            //case 77:
            //case 78:
            //    this.atkMV.visible = true;
            //    this.atkMV.load(77,1,300,240)
            //    this.atkMV.x = -180
            //    this.atkMV.y = 40
            //    this.atkMV.play();
            //    break;
        }
    }

}