class SlaveUI extends MainBase {

    private static _instance: SlaveUI;
    public static getInstance(): SlaveUI {
        if(!this._instance)
            this._instance = new SlaveUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;

    private dataArray = new eui.ArrayCollection()

    public constructor() {
        super();
        this.skinName = "SlaveUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.useVirtualLayout = false
        this.list.itemRendererFunction = function(item:any){
             if(item.gameid == UM.gameid)
                return SlaveMasterItem
            return SlaveItem
        }
        this.list.dataProvider = this.dataArray

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){

    }
    public hide() {
        super.hide();
    }

    public onShow(){
        SlaveManager.getInstance().slave_list(()=>{
            this.renew();
        })

        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var SM =  SlaveManager.getInstance()
        var arr = SM.slaveList.concat();
        var len = SM.getMySlaveNum();
        var maxLen = SM.getCurrentMax();
        while(len < maxLen)
        {
            arr.push({empty:true})
            len ++;
        }

        if(maxLen < SM.maxNum)
            arr.push({lock:true})
        arr.push({btn:true})

        this.dataArray.source = arr
        this.dataArray.refresh()
    }
}