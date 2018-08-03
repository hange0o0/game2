class BagUI extends game.BaseWindow {

    private static _instance: BagUI;
    public static getInstance(): BagUI {
        if(!this._instance)
            this._instance = new BagUI();
        return this._instance;
    }

    private tab: eui.TabBar;
    private scroller: eui.Scroller;
    private list: eui.List;
    private emptyGroup: eui.Group;
    private helpBtn: eui.Image;
    private cdText: eui.Label;



    private dataArray = new eui.ArrayCollection()

    private getNextData;
    public constructor() {
        super();
        this.skinName = "BagUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;

        this.list.dataProvider = this.dataArray
        this.list.itemRendererFunction = ()=>{
            if(this.tab.selectedIndex == 0)
                return BagItem;
            return BagSellItem;
        }

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;

        this.addBtnEvent(this.helpBtn,()=>{
            HelpManager.getInstance().showHelp('prop');
        })

        //this.list.layout['requestedColumnCount'] = 1
        //this.list.layout['paddingLeft'] = 15
        //this.list.layout['verticalGap'] = 10
        //this.list.layout['paddingTop'] = 10
    }

    private onTab(){
        this.renew();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.getNextData = false
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        if(this.currentState == 'sell')
        {
            var PM = PropManager.getInstance();
            if(DateUtil.isSameDay(PM.shopTime))
            {
                var cd = DateUtil.getNextDateTimeByHours(0) - TM.now()
                this.cdText.text = DateUtil.getStringBySecond(cd);
            }
            else if(!this.getNextData)
            {
                this.getNextData = true
                PayManager.getInstance().get_shop(()=>{
                    this.renew()
                    this.getNextData = false
                })
            }
        }

    }

    private renewProp(){
        var arr = PropManager.getInstance().getListByType();
        this.dataArray.source = arr
        this.emptyGroup.visible = arr.length == 0;
        this.dataArray.refresh()
        this.currentState = 'prop'
    }
    private renewSell(){
        this.currentState = 'sell'
        PropManager.getInstance().getSellList(()=>{
            var arr = PropManager.getInstance().shopData;
            this.dataArray.source = arr
            this.emptyGroup.visible = arr.length == 0;
            this.dataArray.refresh()
            this.onTimer();
        })

    }

    public renew(){
        if(this.tab.selectedIndex == 0)
            this.renewProp();
        else
           this.renewSell();
    }
}