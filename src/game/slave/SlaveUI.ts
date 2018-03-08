class SlaveUI extends MainBase {

    private static _instance: SlaveUI;
    public static getInstance(): SlaveUI {
        if(!this._instance)
            this._instance = new SlaveUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private scrollGroup: eui.Group;
    private proGroup: eui.Group;
    private cdGroup: eui.Group;
    private cdText: eui.Label;
    private proBtn: eui.Button;
    private helpBtn: eui.Button;
    private masterGroup: eui.Group;
    private masterItem: SlaveMasterItem;
    private slaveList: eui.List;
    private tab: eui.TabBar;
    private group2: eui.Group;
    private scroller2: eui.Scroller;
    private list: eui.List;
    private viewNumText: eui.Label;





    private dataArray = new eui.ArrayCollection()

    public constructor() {
        super();
        this.skinName = "SlaveUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller2.viewport = this.list;
        this.list.itemRenderer = ViewItem;


        this.slaveList.itemRenderer = SlaveItem
        //this.list.itemRendererFunction = function(item:any){
        //     if(item.gameid == UM.gameid)
        //        return SlaveMasterItem
        //    return SlaveItem
        //}
        this.slaveList.dataProvider = this.dataArray

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;

        this.addBtnEvent(this.proBtn,this.onPro);

        this.addBtnEvent(this.helpBtn,()=>{
            //if(this.tab.selectedIndex == 0)
                HelpManager.getInstance().showHelp('slave')
            //else
            //    HelpManager.getInstance().showHelp('view')
        })
    }

    private onPro(){
        SlaveAddProUI.getInstance().show(UM.gameid,SlaveManager.getInstance().protime);
    }

    private onTab(){
        this.renew();
    }
    public hide() {
        super.hide();
    }

    public onShow(){
        this.tab.selectedIndex = 0;
        this.group2.visible = false
        this.scroller.visible = false
        this.viewNumText.text = ''
        SlaveManager.getInstance().slave_list(()=>{
            this.renew();
        })

        this.addPanelOpenEvent(GameEvent.client.slave_change,this.renew)
        this.addPanelOpenEvent(GameEvent.client.view_change,this.renew)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        if(this.scroller.visible)
        {
            for(var i=0;i<this.slaveList.numChildren;i++)
            {
                this.slaveList.getChildAt(i)['onTimer']();
            }
            if(this.masterItem.stage)
                this.masterItem.onTimer();
            if(this.cdGroup.stage)
            {
                var SM =  SlaveManager.getInstance()
                var cd = SM.protime - TM.now();
                if(cd > 0)
                {
                    if(cd < 3600*24)
                        this.cdText.text = DateUtil.getStringBySecond(cd)
                    else
                        this.cdText.text = DateUtil.getStringBySeconds(cd,false,2)
                }
                else
                {
                    this.renewProGroup();
                }
            }
        }

    }

    public renew(){
        this.helpBtn.visible = this.tab.selectedIndex == 0
        if(this.tab.selectedIndex == 0)
        {
            SlaveManager.getInstance().slave_list(()=>{
                this.renewTab0();
            })
        }
        else
        {
            SlaveManager.getInstance().viewList(()=>{
                this.renewTab1();
            })
        }

    }
    public renewTab1(){
        var SM =  SlaveManager.getInstance()
        this.group2.visible = true
        this.scroller.visible = false
        var arr = SM.getViewList();
        this.list.dataProvider = new eui.ArrayCollection(arr)
        this.viewNumText.text = '关注数量：' + arr.length + '/' + SM.maxViewNum
        this.onTimer();
    }

    public renewTab0(){
        this.group2.visible = false
        this.scroller.visible = true
        this.scroller.viewport.scrollV = 0;
        var SM =  SlaveManager.getInstance()
        var arr = SM.slaveList.concat();
        var len = SM.slaveList.length
        if(SM.master)//有主人
        {
            MyTool.removeMC(this.proGroup)
            this.scrollGroup.addChildAt(this.masterGroup,0)
            this.masterItem.data = SM.master;
        }
        else
        {
            this.scrollGroup.addChildAt(this.proGroup,0)
            MyTool.removeMC(this.masterGroup)
            this.renewProGroup();
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
        this.onTimer();
    }

    private renewProGroup(){
        var SM =  SlaveManager.getInstance()
        var cd = SM.protime - TM.now();
        if(cd > 0)
        {
            this.proGroup.addChildAt(this.cdGroup,0)
        }
        else
        {
             MyTool.removeMC(this.cdGroup);
        }
    }
}