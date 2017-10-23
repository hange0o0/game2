class PKingUI extends game.BaseUI {
    private static instance:PKingUI;
    public static getInstance() {
        if (!this.instance) this.instance = new PKingUI();
        return this.instance;
    }

    private cardGroup: eui.Group;
    private placeGroup: eui.Group;
    private pkVideo: PKVideoCon;








    public constructor() {
        super();
        this.skinName = "PKingUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
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
                {id:1,openid:'npc',team:2,handcard:[],autolist:'1,2,1,2,1|2|1,1,2',base:{
                    1:{atk:10,hp:50,speed:5},
                    2:{atk:10,hp:200,speed:5}
                }},
                {id:2,openid:UM.openid,team:1,handcard:[1,2,1,2,1,1,2,2,2,1,1,1],base:{
                    1:{atk:10,hp:50,speed:5},
                    2:{atk:10,hp:200,speed:5}
                }}
            ]
        };

        this.pkVideo.init();
        PD.init(data)
        this.onE();
    }

    public onE(){
        var PC = PKCode.getInstance()
        var PD = PKData.getInstance()
        var isOver = PC.onStep()     //跑数据

        //表现动画
        this.pkVideo.action();

        if(isOver)
        {

        }

    }






}