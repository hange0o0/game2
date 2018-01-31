class SlaveUI extends MainBase {

    private static _instance: SlaveUI;
    public static getInstance(): SlaveUI {
        if(!this._instance)
            this._instance = new SlaveUI();
        return this._instance;
    }

    private scroller2: eui.Scroller;
    private list: eui.List;
    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private masterGroup: eui.Group;
    private masterItem: SlaveMasterItem;
    private slaveList: eui.List;
    private tab: eui.TabBar;


    private dataArray = new eui.ArrayCollection()

    public constructor() {
        super();
        this.skinName = "SlaveUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller2.viewport = this.list;


        this.slaveList.itemRenderer = SlaveItem
        //this.list.itemRendererFunction = function(item:any){
        //     if(item.gameid == UM.gameid)
        //        return SlaveMasterItem
        //    return SlaveItem
        //}
        this.slaveList.dataProvider = this.dataArray

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTab(){
        this.renew();
    }
    public hide() {
        super.hide();
    }

    public onShow(){
        this.tab.selectedIndex = 0;
        SlaveManager.getInstance().slave_list(()=>{
            this.renew();
        })

        this.addPanelOpenEvent(GameEvent.client.slave_change,this.renew)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        for(var i=0;i<this.slaveList.numChildren;i++)
        {
            this.slaveList.getChildAt(i)['onTimer']();
        }
        if(this.masterItem.stage)
            this.masterItem.onTimer();
    }

    public renew(){
        if(this.tab.selectedIndex == 0)
            this.renewTab0();
        else
            this.renewTab1();
    }
    public renewTab1(){
        this.scroller2.visible = true
        this.scroller.visible = false
    }

    public renewTab0(){
        this.scroller2.visible = false
        this.scroller.visible = true
        this.scroller.viewport.scrollV = 0;
        var SM =  SlaveManager.getInstance()
        var arr = SM.slaveList.concat();
        var len = SM.slaveList.length
        if(SM.master)//有主人
        {
            this.scrollGroup.addChildAt(this.masterGroup,0)
            this.masterItem.data = SM.master;
        }
        else
        {
            MyTool.removeMC(this.masterGroup)
        }
        var maxLen = SM.getCurrentMax();
        while(len < maxLen)
        {
            arr.push({empty:true})
            len ++;
        }

        if(maxLen < SM.maxNum)
            arr.push({lock:true})

        while(arr.length%3 != 0)
            arr.push({pos:true})

        this.dataArray.source = arr
        this.dataArray.refresh()
    }
}