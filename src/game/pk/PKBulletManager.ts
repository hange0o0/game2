class PKBulletManager {
    private static instance:PKBulletManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKBulletManager();
        return this.instance;
    }

    private arrowPool = [];
    private bulletPool = [];
    private bulletAniPool = [];
    private useItem = [];

    //有抛物线
    public createArrow(fromMC,toMC,beginTime,endTime,id?):ArrowMC{
        var item:ArrowMC = this.arrowPool.pop();
        if(!item)
        {
            item = new ArrowMC();
        }
        item.init(fromMC,toMC,beginTime,endTime,id);
        this.useItem.push(item);
        return item;
    }


    //直线
    public createBullet(fromMC,toMC,beginTime,endTime,id?):ArrowMC{
        var item:BulletMC = this.bulletPool.pop();
        if(!item)
        {
            item = new BulletMC();
        }
        item.init(fromMC,toMC,beginTime,endTime,id);
        this.useItem.push(item);
        return item;
    }

    //直线2
    public createBulletAni(fromMC,toMC,beginTime,endTime,id?):ArrowMC{
        var item:BulletAniMC = this.bulletAniPool.pop();
        if(!item)
        {
            item = new BulletAniMC();
        }
        item.init(fromMC,toMC,beginTime,endTime,id);
        this.useItem.push(item);
        return item;
    }

    public freeItem(item){
        if(!item)
            return;
        item.remove();
        if(item.type == 'arrow')
            this.arrowPool.push(item);
        else if(item.type == 'bullet')
            this.bulletPool.push(item);
        else if(item.type == 'bullet_ani')
            this.bulletAniPool.push(item);
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
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime
    constructor() {
        super();
        this.mc.source = 'pk_arrow_png'
        this.mc.anchorOffsetX = 30
        this.mc.anchorOffsetY = 25
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime,id){
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
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2
        var toY = this.toMC.y - this.toMC.data.getVO().height/2

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
        this.y =  fromY + (toY - fromY)*rate - addY
        this.rotation = this.fromMC.x < this.toMC.x ? -rotation:rotation
        this.mc.scaleX = this.fromMC.x < this.toMC.x ? 1:-1
        return true;

    }

    public remove(){
        MyTool.removeMC(this);
    }
}

class BulletMC extends egret.DisplayObjectContainer{
    public type = 'bullet'

    public mc = new eui.Image()
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime

    constructor() {
        super();
        this.mc.source = 'pk_arrow_png'
        this.mc.anchorOffsetX = 30
        this.mc.anchorOffsetY = 25
        this.addChild(this.mc)
    }

    public init(fromMC,toMC,beginTime,endTime,id){
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;

    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = (t - this.beginTime)/(this.endTime - this.beginTime);
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2
        var toY = this.toMC.y - this.toMC.data.getVO().height/2
        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x)*rate
        this.y =  fromY + (toY - fromY)*rate
        this.rotation = this.getRota(
            {x:this.fromMC.x,y:fromY},
            {x:this.toMC.x,y:toY}
        );
        return true;

    }

    public getRota(begin,end){
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14// + 90
    }

    public remove(){
        MyTool.removeMC(this);
    }
}

class BulletAniMC extends egret.DisplayObjectContainer{
    public type = 'bullet_ani'

    public mc;
    public fromMC:PKMonsterItem
    public toMC:PKMonsterItem
    public beginTime
    public endTime

    constructor() {
        super();
    }

    public init(fromMC,toMC,beginTime,endTime,id){
        this.fromMC = fromMC;
        this.toMC = toMC;
        this.beginTime = beginTime;
        this.endTime = endTime;

        var AM = AniManager.getInstance();
        if(this.mc)
            AniManager.getInstance().removeMV(this.mc);
        this.mc = AM.getAni(AM.getMVKey(id));
        this.mc.scaleX = this.mc.scaleY = 0.3
        this.mc.x = 0
        this.mc.y = 0
        this.addChild(this.mc)
    }

    public onAction(t){
        if(t > this.endTime)
            return false;
        var rate = egret.Ease.sineIn((t - this.beginTime)/(this.endTime - this.beginTime));
        var fromY = this.fromMC.y - this.fromMC.data.getVO().height/2
        var toY = this.toMC.y - this.toMC.data.getVO().height/2
        this.x = this.fromMC.x + (this.toMC.x - this.fromMC.x)*rate
        this.y =  fromY + (toY - fromY)*rate
        this.rotation = this.getRota(
            {x:this.fromMC.x,y:fromY},
            {x:this.toMC.x,y:toY}
        );

        return true;

    }

    public getRota(begin,end){
        return Math.atan2(end.y - begin.y,end.x - begin.x)* 180/3.14 + 90
    }

    public remove(){
        MyTool.removeMC(this);
        AniManager.getInstance().removeMV(this.mc);
        this.mc = null;
    }
}
