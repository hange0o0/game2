class MainBase extends game.BaseContainer {
    public constructor() {
        super();
    }

    private panelEvents = {};
    public childrenCreated() {
        super.childrenCreated();
    }

    public show(con){
        con.addChild(this);
        this.height = GameManager.stage.stageHeight - 110;
        this.onShow();
    }

    public onShow(){

    }
    public showFinish(){

    }

    public hide(){
        MyTool.removeMC(this)
        for(var key in this.panelEvents){
            EM.removeEvent(key, this.panelEvents[key], this);
        }
    }

    public addPanelOpenEvent(type:string, callBack:Function){
        this.panelEvents[type] = callBack;
        EM.addEvent(type, callBack, this);
    }
}