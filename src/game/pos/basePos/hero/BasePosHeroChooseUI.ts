class BasePosHeroChooseUI extends game.BaseWindow {

    private static _instance: BasePosHeroChooseUI;
    public static getInstance(): BasePosHeroChooseUI {
        if(!this._instance)
            this._instance = new BasePosHeroChooseUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private titleText: eui.Label;
    private emptyGroup: eui.Group;




    private pos;
    public constructor() {
        super();
        this.skinName = "BasePosHeroChooseUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = BasePosHeroChooseItem;
        this.touchEnabled = false

        this.list.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);
    }

    private onSelect(){
        if(game.BaseUI.isStopEevent)
            return;

        var item = this.list.selectedItem;
        if(!item)
            return;
        BasePosUI.getInstance().resetHero(item.id)
        this.hide();
        //if(item.remove)
        //{
        //    BasePosUI.getInstance().resetHero(item.remove,0)
        //    this.hide();
        //    return;
        //}
        //if(item.id)
        //{
        //    if(this.pos[item.id])
        //        BasePosUI.getInstance().resetHero(this.pos[item.id],0)
        //    BasePosUI.getInstance().resetHero(this.dataIn.index,item.id)
        //    this.hide();
        //}

    }



    public show(pos?){
        this.pos = pos;
        super.show();
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        this.titleText.text = '选择英雄'
        var arr = HeroManager.getInstance().getMyHeroList();
        ArrayUtil.sortByField(arr,['temp','id'],[1,0])
        var list = [];
        //if(this.dataIn.id)
        //    list.push({remove:this.dataIn.index})
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i].id;
            if(!this.pos[id])
                list.push({id:id})
        }
        this.list.dataProvider = new eui.ArrayCollection(list)
        this.emptyGroup.visible = list.length == 0
    }
}