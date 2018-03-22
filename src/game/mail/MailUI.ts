class MailUI extends game.BaseUI {

    private static _instance: MailUI;
    public static getInstance(): MailUI {
        if(!this._instance)
            this._instance = new MailUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;
    private emptyGroup: eui.Group;


    private typeObj = {
        0:{type:[1,2,3],name:'奴隶'},
        1:{type:[101],name:'系统'},
        2:{type:['pk'],name:'对战',isPK:true}
    }

    public constructor() {
        super();
        this.skinName = "MailUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('消息')

        this.scroller.viewport = this.list;
        this.list.itemRendererFunction = function(item:any){
            if(item.pktime)
                return MailPKItem
            return MailItem
        }

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){
        this.topUI.setTitle(this.typeObj[this.tab.selectedIndex].name);
        this.renew();
    }

    public show(){
        MailManager.getInstance().getMail(()=>{
            if(MailManager.getInstance().getNotAwardNum())
            {
                 this.tab.selectedIndex = 1;
            }
            this.renew();
        })
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.mail_change,this.justRenewList)
    }

    private justRenewList(){
        MyTool.renewList(this.list);
    }

    public renew(){
        if(this.typeObj[this.tab.selectedIndex].isPK)
        {
           PKManager.getInstance().getPKRecord(()=>{
               this.renewPK();
           });
        }
        else
        {
            var list = MailManager.getInstance().getListByTpyes(this.typeObj[this.tab.selectedIndex].type)
            this.list.dataProvider = new eui.ArrayCollection(list);
            this.emptyGroup.visible = list.length == 0;
        }

    }

    private renewPK(){
        var list = PKManager.getInstance().recordList;
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.emptyGroup.visible = list.length == 0;
    }
}