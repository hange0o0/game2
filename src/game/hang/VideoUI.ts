class VideoUI extends game.BaseUI {

    private static _instance: VideoUI;
    public static getInstance(): VideoUI {
        if(!this._instance)
            this._instance = new VideoUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private emptyGroup: eui.Group;
    private desText: eui.Label;





    public constructor() {
        super();
        this.skinName = "VideoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('对战记录')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = MailPKItem
    }

    private onTab(){
        //this.topUI.setTitle(this.typeObj[this.tab.selectedIndex].name);
        this.renew();
    }

    public show(){
        //MailManager.getInstance().getMail(()=>{
        //    if(MailManager.getInstance().getNotAwardNum())
        //    {
        //         this.tab.selectedIndex = 1;
        //    }
        //    this.renew();
        //})
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }


    public renew(){
        var list = PKManager.getInstance().recordList;
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.emptyGroup.visible = list.length == 0;
        this.desText.text = '只保留最近'+ PKManager.getInstance().recordLen + '条PK记录'
    }
}