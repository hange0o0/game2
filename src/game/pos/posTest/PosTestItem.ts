class PosTestItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "PosTestItemSkin";
    }

    private addText: eui.Label;
    private desText: eui.Label;
    private list: eui.List;


    private dataArray = new eui.ArrayCollection()
    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = PosListHeadItem
        this.list.dataProvider = this.dataArray

        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        if(this.data.add)
        {
            var index = 0;
            var list = PosManager.getInstance().getListByType(this.data.type)
            for(var i=0;i<5;i++)
            {
                if(!list[i] || !list[i].list)
                {
                    index = i;
                    break;
                }
            }
            BasePosUI.getInstance().show(this.data.type,null,{index:index})
            PosTestUI.getInstance().hide();
            return;
        }
        PosTestUI.getInstance().test(this.data.data)
        PosTestUI.getInstance().hide();
    }

    public dataChanged(){
        if(this.data.add)
        {
            this.currentState = 'add'
            if(this.data.type == 'atk')
                this.desText.text = '添加新的进攻阵容'
            else
                this.desText.text = '添加新的防守阵容'
            return;
        }

        this.currentState = 'normal'
        var data = this.data.data;
        //var str = data.list
        var str = data.list//.replace(new RegExp("#","g"),",")
        var list = str.split(',');
        if(data.hero)
        {
            var hero = data.hero.split(',');
            for(var i=0;i<hero.length;i++)
            {
                var id = hero[i];
                hero[i] = {
                    id: id,
                    isHero: true,
                    lv: HeroManager.getInstance().getHeroLevel(id),
                }
            }
            list = hero.concat(list)
        }

        //console.log(list)
        this.dataArray.source = list;
        this.dataArray.refresh()

        this.desText.text = this.data.name + '  ('+list.length+'/'+PosManager.getInstance().maxPosNum()+')';
    }

}