class FirstPayUI extends game.BaseWindow {
    private static instance:FirstPayUI;
    public static getInstance() {
        if (!this.instance) this.instance = new FirstPayUI();
        return this.instance;
    }

    private cancelBtn: eui.Button;
    private okBtn: eui.Button;


    private monsterArr = []
    public constructor() {
        super();
        this.skinName = "FirstPayUISkin";
    }


    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.cancelBtn, this.hide);
        this.addBtnEvent(this.okBtn, this.onClick);

        var arr = [101,106,108,113,116]
        var des = 60
        var begin = (480 - ((arr.length-1)*des))/2
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            var item = PKMonsterMV.createItem();
            this.addChild(item);
            item.load(id)
            item.stand();
            item.scaleX = item.scaleY = 1.2;
            item.y = 250 + Math.random()*80
            item.x = begin + i*des
            this.monsterArr.push(item);
        }

        ArrayUtil.sortByField(this.monsterArr,['y'],[0]);
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.addChild(this.monsterArr[i]);
        }
    }

    private onClick(){
         if(UM.rmb)//未领
         {
             PayManager.getInstance().getFirstPay(()=>{
                 this.hide();
             })
             return;
         }
        FromManager.getInstance().pay(101,()=>{

        });
    }


    public show(localOrder?,goodsid?){
        if(ActiveManager.getInstance().first_pay)
            return;
        super.show();
    }

    public hide(){
        super.hide();
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.monsterArr[i].stop();
        }
    }

    public onShow(){
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.monsterArr[i].play();
        }

        this.renew();
        this.addPanelOpenEvent(GameEvent.client.rmb_change,this.renew)
    }

    private renew(){
        if(UM.rmb)
        {
            this.okBtn.label = '马上领取'
            MyTool.removeMC(this.cancelBtn)
        }
        else
        {
            this.okBtn.label = '首充6元'
        }
    }



}