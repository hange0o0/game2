class TecUI extends MainBase {

    private static _instance: TecUI;
    public static getInstance(): TecUI {
        if(!this._instance)
            this._instance = new TecUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private tab: eui.TabBar;

    private dataArray = new eui.ArrayCollection()

    public constructor() {
        super();
        this.skinName = "TecUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = TecItem
        this.list.dataProvider = this.dataArray

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
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.tec_change,this.renew)
    }

    public renew(){
        var arr =  TecManager.getInstance().getListByType(this.tab.selectedIndex + 1);
        this.dataArray.source = arr
        this.dataArray.refresh()
    }

    public setTab(index){
        this.tab.selectedIndex = index;
        this.renew();
        /*       TecVO.getObject(1).name
         战斗界面由上往下分别为对方出牌记录区，战场，我的出战区，我的手牌区
         战斗的过程一般为：从[手牌]选择合适的卡牌->将其拖入[出战区]-> [出战区]的卡牌生效后出现在[战场]-> [战场]中的单位冲过敌方出生点后造成伤害->当其中一方的生命被消耗为0时，游戏结束
         注意，当进入战斗时，战场中部会出现一个[防御石]，所有攻击其的单位会为已方队伍获取1点防御积分，每满5点积分增加1点队伍防御。[防御石]被攻击满50次后消失，从此刻起双方短兵相接
         当战斗卡牌被放入[出战区]时，都有3秒的准备时间，准备时间过后，卡牌即会生效。
         玩家的队伍生命由'+TecVO.getObject(1).name+'决定，升级科技会获得提升
         */
    }
}