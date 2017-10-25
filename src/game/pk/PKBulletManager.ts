class PKBulletManager {
    private static instance:PKBulletManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKBulletManager();
        return this.instance;
    }

    private arrowPool = [];
    private useItem = [];

    public createArrow(fromMC,toMC,beginTime,endTime):ArrowMC{
        var item:ArrowMC = this.arrowPool.pop();
        if(!item)
        {
            item = new ArrowMC();
        }
        item.init(fromMC,toMC,beginTime,endTime);
        this.useItem.push(item);
        return item;
    }

    public freeItem(item){
        if(!item)
            return;
        item.remove();
        if(item.type == 'arrow')
            this.arrowPool.push(item);
        ArrayUtil.removeItem(this.useItem,item)
    }

    public actionAll(){
        var PD = PKData.getInstance();
        var removeArr = [];
        for(var i=0;i<this.useItem.length;i++)
        {
             var item = this.useItem[i];
            if(!item.onAction(PD.actionTime))
            {
                removeArr.push(item);
            }
        }
        for(var i=0;i<removeArr.length;i++)
        {
            this.freeItem(removeArr[i]);
        }
    }
}

class ArrowMC extends egret.DisplayObjectContainer{
    public type = 'arrow'

    public mc = new eui.Image()
    public fromMC
    public toMC
    public beginTime
    public endTime
    constructor() {
        super();
        this.mc.source = 'pk_arrow_png'
        this.mc.anchorOffsetX = 10
        this.mc.anchorOffsetY = 25
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime){
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;

    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = (t - this.beginTime)/(this.endTime - this.beginTime);
        var dis = Math.abs(this.toMC.x - this.fromMC.x);

        if(rate<=0.5)
        {
            var addY = dis*rate;
        }
        else
        {
            var addY = dis*(1-rate);
        }
        addY = Math.pow(addY,0.6);
        var maxAddY =  Math.pow(dis*0.5,0.6);

        if(rate<=0.5)
            var rotation = maxAddY - addY
        else
            var rotation = -(maxAddY - addY)

        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x)*rate
        this.y =  -50 + this.fromMC.y + (this.toMC.y - this.fromMC.y)*rate - addY
        this.rotation = this.fromMC.x < this.toMC.x ? -rotation:rotation
        this.mc.scaleX = this.fromMC.x < this.toMC.x ? 1:-1
        return true;

    }

    public remove(){
        MyTool.removeMC(this);
    }
}
