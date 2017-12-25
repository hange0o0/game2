class AtkPosUI extends game.BaseUI {

    private static _instance: AtkPosUI;
    public static getInstance(): AtkPosUI {
        if(!this._instance)
            this._instance = new AtkPosUI();
        return this._instance;
    }

    private scrollerBG: eui.Group;
    private topUI: TopUI;
    private scroller1: eui.Scroller;
    private list1: eui.List;
    private scroller2: eui.Scroller;
    private list2: eui.List;
    private tab: eui.TabBar;
    private downList: DownList;
    private bottomUI: BottomUI;
    private btnGroup: eui.Group;
    private renameBtn: eui.Group;
    private deleteBtn: eui.Group;
    private testBtn: eui.Group;
    private saveBtn: eui.Group;






    private monsterType = 0
    private skillType = 0
    private index = 0  //第X个阵
    public useCard = {}
    public maxCard = 0;

    private posName = ''
    private posData
    private arrayData:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "AtkPosUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.bottomUI.setHide(this.onClose,this);
        //this.keyBoard.hide();
        //this.keyBoard.addEventListener('key_change',this.onKeyBoard,this)

        this.addBtnEvent(this.deleteBtn,this.onDelete)
        this.addBtnEvent(this.renameBtn,this.onRename)
        this.addBtnEvent(this.saveBtn,this.onSave)
        this.addBtnEvent(this.testBtn,this.onTest)

        this.scroller1.viewport = this.list1;
        this.list1.itemRenderer = AtkPosItem
        this.scroller1.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        this.list1.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);

        this.scroller2.viewport = this.list2;
        this.list2.itemRenderer = PosCardItem
        this.list2.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);

        //var arr = CM.m_shows.getLevelList();
        //this.downList.setData(arr,0);
        this.downList.addEventListener(DownList.SELECT,this.onDownListSelect,this);

        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
    }

    private onTest(){
        PosTestUI.getInstance().show('atk',{
            list:this.changeToServerList(),
            name:Base64.encode(this.posName),
        })
    }

    private onScroll(){
        this.scrollerBG.y = this.scroller1.y - this.scroller1.viewport.scrollV;
    }


    public changeToServerList(){
        var arr = [];
        for(var i=0;i<this.arrayData.length-1;i++)
        {
            arr.push(this.arrayData.getItemAt(i).id)
        }
        return arr.join(',');
    }

    public onClose(){
        if(!this.posData && this.arrayData.length > 1)
        {
            Confirm('还没保存，确定退出吗？',(b)=>{
                if(b==1)
                {
                    this.hide();
                }
            })
            return;
        }
        if(this.posData && (Base64.decode(this.posData.name) != this.posName || this.posData.list != this.changeToServerList()))
        {
            Confirm('还没保存，确定退出吗？',(b)=>{
                if(b==1)
                {
                    this.hide();
                }
            })
            return;
        }
        this.hide();
    }


    private onDelete(){
        Confirm('确定要删除该阵法吗？',(b)=>{
            if(b==1)
            {
                PosManager.getInstance().deletePos('atk',this.posData.id,()=>{
                    this.index = PosManager.getInstance().atkList.length;
                    this.renew();
                })
            }
        })
    }

    private onRename(){
        PosNameUI.getInstance().show(this.posName)
        PosNameUI.getInstance().once('nameChange',this.onNameChange,this)
    }

    private onNameChange(e){
        this.posName = e.data
        this.renewTitle();
    }

    private onSave(){
        if(this.arrayData.length == 0)
        {
            Alert('必须上阵最少一张卡牌')
            return
        }
        var serverList = this.changeToServerList();
        if(this.posData)
        {
            PosManager.getInstance().changePos('atk',this.posData.id,
                this.posName,serverList,()=>{
                    ShowTips('保存成功！')
                    //this.hide();
                })
        }
        else
        {
            PosManager.getInstance().addPos('atk',
                this.posName,serverList,()=>{
                    ShowTips('保存成功！')
                    //this.hide();
                    //this.posData = PosManager.getInstance().atkList[this.index]
                })
        }
    }

    private onChange(){
        this.arrayData.removeItemAt(this.arrayData.length - 1)
         AtkPosChangeUI.getInstance().show(this.arrayData)
    }

    private getListData(){
        return this.arrayData.source;
    }

    private onDownListSelect(){
        if(this.tab.selectedIndex == 0)
              this.monsterType = this.downList.selectValue;
        else
              this.skillType = this.downList.selectValue;
        this.renewList();
    }

    private onTab(){
        this.renewDownList();
        this.renewList();
    }

    //选中
    private onSelect(){
        if(game.BaseUI.isStopEevent)
            return;


        var item = this.list2.selectedItem;
        if(this.maxCard <= this.arrayData.length)
            return;
        if(this.useCard[item.id] && this.useCard[item.id] >= PosManager.getInstance().oneCardNum)
            return;

        this.useCard[item.id] = (this.useCard[item.id] || 0) + 1
        this.arrayData.addItemAt({id:item.id},this.arrayData.length-1)
        this.justRenewList2();
        this.renewTitle();
        this.once(egret.Event.ENTER_FRAME,function(){
            var dec = this.scroller1.viewport.contentHeight -  this.scroller1.viewport.height;
            if(this.scroller1.viewport.scrollV < dec)
            {
                this.scroller1.viewport.scrollV = dec
                this.onScroll();
            }
        },this)

    }

    private onUnSelect(){
        var item = this.list1.selectedItem;
        if(item.isSetting)
        {
            this.onChange();
            return;
        }
        if(game.BaseUI.isStopEevent)
            return;

        this.deleteID(item.id)
        this.arrayData.removeItemAt(this.arrayData.getItemIndex(item))
        this.justRenewList2()
        //this.useCard[item.id] --;


        this.once(egret.Event.ENTER_FRAME,function(){

            var dec = this.scroller1.viewport.contentHeight -  this.scroller1.viewport.height;
            if(dec<=0)
            {
                if(this.scroller1.viewport.scrollV != 0)
                {
                    this.scroller1.viewport.scrollV = 0;
                    this.onScroll();
                }
                return;
            }

            if(this.scroller1.viewport.scrollV > dec)
            {
                this.scroller1.viewport.scrollV = dec;
                this.onScroll();
            }
        },this)

    }

    private renewDownList(){
        this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
        if(this.tab.selectedIndex == 0)
        {
            var arr = [
                {label:'全部',data:0},
                {label:PKConfig.TYPENAME[1],data:1,icon: 'icon_type1_png'},
                {label:PKConfig.TYPENAME[2],data:2,icon: 'icon_type2_png'},
                {label:PKConfig.TYPENAME[3],data:3,icon: 'icon_type3_png'}];
            this.downList.setData(arr,this.monsterType);
        }
        else
        {
            var arr = [
                {label:'全部',data:0},
                {label:PKConfig.SKILLTYPENAME[1],data:1,icon: 'skill_type1_png'},
                {label:PKConfig.SKILLTYPENAME[2],data:2,icon: 'skill_type2_png'},
                {label:PKConfig.SKILLTYPENAME[3],data:3,icon: 'skill_type3_png'},
                {label:PKConfig.SKILLTYPENAME[4],data:4,icon: 'skill_type4_png'},
                {label:PKConfig.SKILLTYPENAME[5],data:5,icon: 'skill_type5_png'}];
            this.downList.setData(arr,this.skillType);
        }
    }


    public show(v?){
        this.index = v;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.maxCard = PosManager.getInstance().maxPosNum();
        this.renew();
        //this.addPanelOpenEvent(ServerEvent.Client.BUSINESS_BUILDING_RENEW,this.renew)
    }

    public renew(){
        var PM = PosManager.getInstance();
        var data = this.posData = PM.atkList[this.index]
        this.useCard = {};
        var arr = [];
        if(data)
        {
            this.posName = Base64.decode(data.name) || '未命名';

            var list = data.list.split(',')
            for(var i=0;i<list.length;i++)
            {
                var id = list[i];
                this.useCard[id] = (this.useCard[id] || 0) + 1;
                arr.push({id:id})
            }

            this.btnGroup.addChildAt(this.deleteBtn,0)
        }
        else
        {
            this.posName = '未命名' + this.index;
            MyTool.removeMC(this.deleteBtn)
        }
        arr.push({isSetting:true})
        this.arrayData = new eui.ArrayCollection(arr)
        this.list1.dataProvider = this.arrayData
        this.renewTitle();
        this.renewList();
        this.renewDownList();
    }

    private renewTitle(){
        this.topUI.setTitle(this.posName + '('+this.arrayData.length+'/'+this.maxCard+')')
    }

    public deleteID(id){
        this.useCard[id] --;
        this.renewTitle();
    }

    public justRenewList2(){
        MyTool.renewList(this.list2)
        this.renewTitle();
    }
    public addSetting(){
        this.arrayData.addItem({isSetting:true})
    }

    private renewList(){
        this.scroller2.stopAnimation();
         var type = this.downList.selectValue;
        var arr;
        if(this.tab.selectedIndex == 0)
        {
            arr = CardManager.getInstance().getMyMonsterList(type)
        }
        else
        {
            arr = CardManager.getInstance().getMySkillList(type)
        }
        for(var i=0;i<arr.length;i++)
        {
            arr[i].temp = this.useCard;
        }
        this.list2.dataProvider = new eui.ArrayCollection(arr)
    }
}