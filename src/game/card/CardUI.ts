class CardUI extends MainBase {

    private static _instance: CardUI;
    public static getInstance(): CardUI {
        if(!this._instance)
            this._instance = new CardUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private valueText: eui.Label;
    private valueText2: eui.Label;
    private desText: eui.Label;
    private skillBtn: eui.Button;
    private tab: eui.TabBar;
    private downList2: DownList;




    private monsterType = 0
    private skillType = 0
    private dataArray = new eui.ArrayCollection()

    //public isFirst = true

    public constructor() {
        super();
        this.skinName = "CardUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CardItem
        this.list.dataProvider = this.dataArray
        this.downList2.addEventListener(DownList.SELECT,this.onDownListSelect,this);


        this.addBtnEvent(this.skillBtn,this.onSkill)
        //this.selectType = 0;

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onSkill(){
        if(PropManager.getInstance().getNum(102) == 0)
        {
            MyWindow.Alert('令牌不足')
            return;
        }
        CardManager.getInstance().card_draw(()=>{
        })
    }

    private onTab(){
        this.renewDownList();
        this.renewList();
    }

    private onDownListSelect(){
        if(this.tab.selectedIndex == 0)
            this.monsterType = this.downList2.selectValue;
        else
            this.skillType = this.downList2.selectValue;
        this.renewList();
    }

    private renewDownList(){
        //this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
        if(this.tab.selectedIndex == 0)
        {
            var arr = [
                {label:'全部',label2: 'x' + CardManager.getInstance().getTotalMonsterList(0).length,data:0,icon: 'monster_all_icon_png'},
                {label:PKConfig.TYPENAME[1],label2: 'x' + CardManager.getInstance().getTotalMonsterList(1).length,data:1,icon: 'icon_type1_png'},
                {label:PKConfig.TYPENAME[2],label2: 'x' + CardManager.getInstance().getTotalMonsterList(2).length,data:2,icon: 'icon_type2_png'},
                {label:PKConfig.TYPENAME[3],label2: 'x' + CardManager.getInstance().getTotalMonsterList(3).length,data:3,icon: 'icon_type3_png'}];
            this.downList2.setData(arr,this.monsterType);
        }
        else
        {
            var arr = [
                {label:'全部',label2: 'x' + CardManager.getInstance().getTotalSkillList(0).length,data:0,icon:'skill_all_icon_png'},
                {label:PKConfig.SKILLTYPENAME[1],label2: 'x' + CardManager.getInstance().getTotalSkillList(1).length,data:1,icon: 'skill_type1_png'},
                {label:PKConfig.SKILLTYPENAME[2],label2: 'x' + CardManager.getInstance().getTotalSkillList(2).length,data:2,icon: 'skill_type2_png'},
                {label:PKConfig.SKILLTYPENAME[3],label2: 'x' + CardManager.getInstance().getTotalSkillList(3).length,data:3,icon: 'skill_type3_png'},
                {label:PKConfig.SKILLTYPENAME[4],label2: 'x' + CardManager.getInstance().getTotalSkillList(4).length,data:4,icon: 'skill_type4_png'},
                {label:PKConfig.SKILLTYPENAME[5],label2: 'x' + CardManager.getInstance().getTotalSkillList(5).length,data:5,icon: 'skill_type5_png'}];
            this.downList2.setData(arr,this.skillType);
        }
    }


    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.card_change,this.renewList)
    }

    public renew(){
        this.renewDownList();
        this.renewList();
    }

    private renewList(){
        var CRM = CardManager.getInstance();
        var type = this.downList2.selectValue;
        var arr;
        if(this.tab.selectedIndex == 0)
        {
            arr =CRM.getTotalMonsterList(type)
            this.currentState = 'monster'
        }
        else
        {
            arr = CRM.getTotalSkillList(type)
            var max = CRM.getOpenSkillList(type).length
            var now = CRM.getMySkillList(type).length
            this.currentState = 'skill'
            this.valueText.text = '令牌×' + PropManager.getInstance().getNum(102)
            this.valueText2.text = '碎片×' + PropManager.getInstance().getNum(103)
            this.desText.text = '收集：' + now + '/' + max;
            MyTool.changeGray(this.skillBtn,now>=max,true)
        }
        ArrayUtil.sortByField(arr,['cost','level','id'],[0,0,0]);
        this.dataArray.source = arr;
        this.dataArray.refresh()
        //this.list.dataProvider = new eui.ArrayCollection(arr)

    }
}