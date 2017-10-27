class PKingUI extends game.BaseUI {
    private static instance:PKingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKingUI();
        return this.instance;
    }

    private scroller: eui.Scroller;
    private pkVideo: PKVideoCon;
    private pkCtrlCon: PKCtrlCon;
    private pkTop: PKTopUI;









    public scrollTime = 0;

    public constructor() {
        super();
        this.skinName = "PKingUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.scroller.addEventListener(egret.Event.CHANGE,this.onScroll,this)
    }

    private onScroll(){
       this.scrollTime = TM.now();
    }

    public hide(){
        super.hide();
        this.removeEventListener(egret.Event.ENTER_FRAME,this.onE,this)
    }

    public show(){
        var self = this;
        self.superShow();
    }

    private superShow(){
        super.show();
    }

    public onShow(){
        this.addEventListener(egret.Event.ENTER_FRAME,this.onE,this)

        var PD = PKData.getInstance()
        var PC = PKCode.getInstance()
        var data = {
           team1:{id:1,hp:1,maxhp:1},
           team2:{id:2,hp:1,maxhp:1},
            players:[
                {id:1,openid:'npc',team:2,card:[],autolist:'2,2,2,1,2,1|2|1,1,2',base:{     //,1,2,1,2,1|2|1,1,2
                    1:MonsterVO.getObject(1),
                    2:MonsterVO.getObject(2)
                }},
                {id:2,openid:UM.openid,team:1,card:[1,2,1,2,1,1,2,2,2,1,1,1],base:{
                    1:MonsterVO.getObject(1),
                    2:MonsterVO.getObject(2)//{atk:10,hp:100,speed:5}
                }}
            ]
        };

        this.scrollTime = 0;
        PD.init(data)
        this.pkVideo.init();
        this.pkCtrlCon.init();
        this.pkTop.init();

        this.onE();
    }

    public onE(){
        var PC = PKCode.getInstance()
        var PD = PKData.getInstance()

        var isOver = PC.onStep()     //跑数据

        //表现动画
        this.pkVideo.action();

        //控制栏动画
        this.pkCtrlCon.onTimer();

        if(isOver)
        {

        }

        if(TM.now() - this.scrollTime > 5)
        {
            this.autoMoveScreen();
        }

    }

    private autoMoveScreen(){
        var item = this.pkVideo.getFirstItem(PKData.getInstance().myPlayer.teamData.id);
        if(item)
        {
            var scrollH = item.x - 320;
            var des = Math.abs(this.scroller.viewport.scrollH - scrollH)
            if(des < 100)
                return;
            if(this.scroller.viewport.scrollH > scrollH)
                scrollH = this.scroller.viewport.scrollH - Math.pow(des - 90,0.5)
            else
                scrollH = this.scroller.viewport.scrollH + Math.pow(des - 90,0.5)

            if(scrollH < 0)
                scrollH = 0;
            else if(scrollH + this.scroller.viewport.width > this.scroller.viewport.contentWidth)
                scrollH  =  this.scroller.viewport.contentWidth - this.scroller.viewport.width
            this.scroller.viewport.scrollH = scrollH
        }
    }






}