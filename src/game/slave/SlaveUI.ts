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
        this.list.itemRenderer = SlaveItem
        //this.list.itemRendererFunction = function(item:any){
        //     if(item.gameid == UM.gameid)
        //        return SlaveMasterItem
        //    return SlaveItem
        //}
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

        this.addPanelOpenEvent(GameEvent.client.slave_change,this.renew)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        for(var i=0;i<this.list.numChildren;i++)
        {
            this.list.getChildAt(i)['onTimer']();
        }
    }

    public renew(){
        var SM =  SlaveManager.getInstance()
        var arr = SM.slaveList.concat();
        var len = SM.getMySlaveNum();
        if(len != arr.length)//有主人
        {
            arr.splice(1,0,{title:'我的奴隶'})
            arr.unshift({title:'我的主人'})
        }
        else
        {
            arr.unshift({title:'我的奴隶'})
        }
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