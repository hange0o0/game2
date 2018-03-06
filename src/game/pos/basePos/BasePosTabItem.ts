class BasePosTabItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "BasePosTabSkin";
    }

    private text: eui.Label;


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this,this.onClick)
    }

    private onClick(){
        BasePosUI.getInstance().setTabSelect(this.data);
    }

    public dataChanged()
    {
        this.text.text = this.data + 1;
        this.renewSelect();
    }

    public renewSelect(){
        var index = BasePosUI.getInstance().index
        var type = BasePosUI.getInstance().type
        var list = PosManager.getInstance().getListByType(type)
        if(this.data == index)
        {
            this.currentState = 'choose'
        }
        else if(type == 'atk')
        {
             if(list[this.data] && list[this.data].list.length > 0)
                 this.currentState = 'normal'
            else
                 this.currentState = 'empty'
        }
        else if(type == 'def')
        {
            if(list[this.data] && list[this.data].list.length > 0)
            {
                if(list[this.data].close)
                    this.currentState = 'lock'
                else
                    this.currentState = 'normal'
            }
            else
                this.currentState = 'empty'
        }

    }
}