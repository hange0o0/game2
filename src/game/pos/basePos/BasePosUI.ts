class BasePosUI extends game.BaseUI {

    private scrollerBG: eui.Group;
    private topUI: TopUI;
    private scroller1: eui.Scroller;
    private list1: eui.List;
    private monsterBG: eui.Group;
    private skillBG: eui.Group;
    private list2: eui.List;
    private leftBtn: eui.Group;
    private leftMC: eui.Image;
    private rightBtn: eui.Group;
    private rightMC: eui.Image;
    private bottomUI: BottomUI;
    private numText: eui.Label;
    private numText2: eui.Label;
    private downList2: LeftList;
    private btnGroup: eui.Group;
    private deleteBtn: eui.Group;
    private renameBtn: eui.Group;
    private testBtn: eui.Group;
    private saveBtn: eui.Group;
    private monsterIcon: eui.Image;
    private skillIcon: eui.Image;











    public selectType
    private monsterType = 0
    private skillType = 0
    private index = 0  //第X个阵
    public useCard = {}
    public maxCard = 0;

    private posName = ''
    private posData
    private arrayData:eui.ArrayCollection

    private page=1;
    private pageSize=6;
    private totalPage=1;


    public type = 'atk'
    public callDelete;

    public constructor() {
        super();
        this.skinName = "BasePosUISkin";
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
        this.addBtnEvent(this.rightBtn,this.onRight)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.monsterIcon,this.onMonster)
        this.addBtnEvent(this.skillIcon,this.onSkill)

        this.scroller1.viewport = this.list1;
        this.list1.itemRenderer = BasePosItem
        this.scroller1.addEventListener(egret.Event.CHANGE,this.onScroll,this)
        this.list1.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onUnSelect,this);

        //this.scroller2.viewport = this.list2;
        this.list2.itemRenderer = PosCardItem
        this.list2.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onSelect,this);

        //var arr = CM.m_shows.getLevelList();
        //this.downList.setData(arr,0);
        //this.downList.addEventListener(DownList.SELECT,this.onTab,this);
        this.downList2.addEventListener(DownList.SELECT,this.onDownListSelect,this);


        this.selectType = 0;

        //this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        //this.tab.selectedIndex = 0;
    }

    private onMonster(){
        if(this.selectType == 0)
            return
        this.selectType = 0
        this.onTab()
    }
    private onSkill(){
        if(this.selectType == 1)
            return
        this.selectType = 1
        this.onTab()
    }

    private onRight(){
        if(this.page < this.totalPage)
        {
            this.page ++ ;
            this.renewList()
        }
    }
    private onLeft(){
        if(this.page > 1)
        {
            this.page -- ;
            this.renewList()
        }
    }

    private onTest(){
        PosTestUI.getInstance().show(this.type,{
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
        if(this.callDelete && !this.posData && this.arrayData.length <= 1)
        {
            PosManager.getInstance().deletePos(this.type,this.callDelete.id,()=>{
                this.hide()
            })
            return;
        }
        var b = !this.posData && this.arrayData.length > 1
        if(!b)
            b = this.posData && (Base64.decode(this.posData.name) != this.posName || this.posData.list != this.changeToServerList())
        if(b)
        {
            Confirm('还没保存，确定退出吗？',(b)=>{
                if(b==2)
                {
                    this.hide();
                }
                else if(b==1)
                {
                    if(this.onSave())
                        this.hide();
                }
            },['直接退出','保存并退出']).closeBtn.visible = true
            return;
        }

        this.hide();
    }


    private onDelete(){
        Confirm('确定要删除该阵法吗？',(b)=>{
            if(b==1)
            {
                this.callDelete = this.posData;
                var name = this.posName;
                this.renew(true);
                this.posName = name;
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
            return false
        }
        var serverList = this.changeToServerList();
        if(this.callDelete)
        {
            this.posData = this.callDelete;
        }
        if(this.posData)
        {
            PosManager.getInstance().changePos(this.type,this.posData.id,
                this.posName,serverList,()=>{
                    ShowTips('保存成功！')
                    this.callDelete = null
                })
        }
        else
        {
            PosManager.getInstance().addPos(this.type,
                this.posName,serverList,()=>{
                    ShowTips('保存成功！')
                    this.callDelete = null
                    this.posData = PosManager.getInstance().getListByType(this.type)[this.index]
                })
        }
        return true
    }

    private onChange(){
        this.arrayData.removeItemAt(this.arrayData.length - 1)
         BasePosChangeUI.getInstance().show(this.arrayData,this)
    }

    private getListData(){
        return this.arrayData.source;
    }

    private onDownListSelect(){
        this.page = 1;
        if(this.selectType == 0)
              this.monsterType = this.downList2.selectValue;
        else
              this.skillType = this.downList2.selectValue;
        this.renewList();
    }

    private onTab(){
        this.page = 1;
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

        this.btnGroup.addChildAt(this.deleteBtn,0)

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

        if(this.arrayData.length <= 1)
            MyTool.removeMC(this.deleteBtn)
    }

    private renewDownList(){
        //this.downList.height = GameManager.stage.stageHeight - 100 - this.downList.y - 10;
        if(this.selectType == 0)
        {
            var arr = [
                {label:'全部',label2: 'x' + CardManager.getInstance().getMyMonsterList(0).length,data:0,icon: 'monster_all_icon_png'},
                {label:PKConfig.TYPENAME[1],label2: 'x' + CardManager.getInstance().getMyMonsterList(1).length,data:1,icon: 'icon_type1_png'},
                {label:PKConfig.TYPENAME[2],label2: 'x' + CardManager.getInstance().getMyMonsterList(2).length,data:2,icon: 'icon_type2_png'},
                {label:PKConfig.TYPENAME[3],label2: 'x' + CardManager.getInstance().getMyMonsterList(3).length,data:3,icon: 'icon_type3_png'}];
            this.downList2.setData(arr,this.monsterType);
        }
        else
        {
            var arr = [
                {label:'全部',label2: 'x' + CardManager.getInstance().getMySkillList(0).length,data:0,icon:'skill_all_icon_png'},
                {label:PKConfig.SKILLTYPENAME[1],label2: 'x' + CardManager.getInstance().getMySkillList(1).length,data:1,icon: 'skill_type1_png'},
                {label:PKConfig.SKILLTYPENAME[2],label2: 'x' + CardManager.getInstance().getMySkillList(2).length,data:2,icon: 'skill_type2_png'},
                {label:PKConfig.SKILLTYPENAME[3],label2: 'x' + CardManager.getInstance().getMySkillList(3).length,data:3,icon: 'skill_type3_png'},
                {label:PKConfig.SKILLTYPENAME[4],label2: 'x' + CardManager.getInstance().getMySkillList(4).length,data:4,icon: 'skill_type4_png'},
                {label:PKConfig.SKILLTYPENAME[5],label2: 'x' + CardManager.getInstance().getMySkillList(5).length,data:5,icon: 'skill_type5_png'}];
            this.downList2.setData(arr,this.skillType);
        }
    }


    public show(v?){
        this.index = v;
        this.callDelete = null;
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

    public renew(noPosData?){
        var PM = PosManager.getInstance();
        var data = this.posData = noPosData?null:PM.getListByType(this.type)[this.index]
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
            this.posName = '新建阵容' + this.index;
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
        var title = this.type == 'atk'?'【进攻阵容】':'【防御阵容】'
        this.topUI.setTitle(title + '- ' + this.posName + ' ('+this.arrayData.length+'/'+this.maxCard+')')
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
        //this.scroller2.stopAnimation();
        var type = this.downList2.selectValue;
        var arr;
        if(this.selectType == 0)
        {
            arr = CardManager.getInstance().getMyMonsterList(type)
            this.monsterBG.visible = true
            this.skillBG.visible = false
            MyTool.addColor(this.monsterIcon,0xFF0000)
            MyTool.addColor(this.skillIcon,-1)
        }
        else
        {
            arr = CardManager.getInstance().getMySkillList(type)
            this.monsterBG.visible = false
            this.skillBG.visible = true
            MyTool.addColor(this.monsterIcon,-1)
            MyTool.addColor(this.skillIcon,0x07B6FF)
        }
        ArrayUtil.sortByField(arr,['cost','level','id'],[0,0,0]);
        this.totalPage = Math.ceil(arr.length/this.pageSize || 1)
        this.numText.text = this.page + ''
        this.numText2.text = '' + this.totalPage
        arr = arr.splice((this.page-1)*this.pageSize,this.pageSize)
        for(var i=0;i<arr.length;i++)
        {
            arr[i].temp = this.useCard;
        }
        this.list2.dataProvider = new eui.ArrayCollection(arr)
        MyTool.changeGray(this.leftMC,this.page == 1)
        MyTool.changeGray(this.rightMC,this.page == this.totalPage)

    }
}