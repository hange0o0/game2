//class HangItem extends game.BaseItem {
//    private static pool = [];
//    private static createID = 1
//    public static createItem():HangItem{
//        var item:HangItem = this.pool.pop();
//        if(!item)
//        {
//            item = new HangItem();
//        }
//        item.id = this.createID
//        this.createID ++;
//        return item;
//    }
//    public static freeItem(item){
//        if(!item)
//            return;
//        item.remove();
//        this.pool.push(item);
//    }
//
//
//    public constructor() {
//        super();
//        this.skinName = "HangItemSkin";
//    }
//
//    private monsterMV:MonsterMV
//
//    public id;
//    public needRemove = true;
//    public atk
//    public hp
//    public speed
//    public atkRota
//    public stopTime
//    public vo:MonsterVO
//    public target:HangItem//攻击目标
//    public targetID//攻击目标ID
//
//    public childrenCreated() {
//        super.childrenCreated();
//
//        this.monsterMV = new MonsterMV();
//        this.addChildAt(this.monsterMV,0)
//        this.monsterMV.x = 50;
//        this.monsterMV.y = 300;
//        this.anchorOffsetX = 50;
//        this.anchorOffsetY = 300;
//        this.monsterMV.addEventListener('mv_die',this.onDieFinish,this)
//    }
//
//    private onDieFinish(){
//        this.needRemove = true;
//    }
//
//    public dataChanged(){
//
//        this.needRemove = false;
//        this.monsterMV.load(this.data)
//        this.monsterMV.play();
//        this.alpha = 1;
//
//        var vo = this.vo = MonsterVO.getObject(this.data);
//        this.atk = vo.atk
//        this.hp = vo.hp
//        this.speed = vo.speed
//
//    }
//
//    public setRota(rota,init?){
//        if(!init && this.monsterMV.scaleX == rota)
//            return;
//        this.monsterMV.scaleX = rota
//    }
//
//    public setRota2(targetX){
//        this.setRota(this.x > targetX ? 1:-1)
//    }
//
//    public run(){
//        if(this.monsterMV.state != MonsterMV.STAT_RUN )
//            this.monsterMV.run();
//        this.x += this.atkRota*this.speed;
//    }
//
//
//    public standMV(){
//        if(this.monsterMV.state != MonsterMV.STAT_STAND)
//            this.monsterMV.stand();
//    }
//
//    public dieMV(){
//        this.monsterMV.die();
//    }
//
//    public atkMV(){
//        this.monsterMV.atk();
//    }
//
//    public remove(){
//        this.needRemove = true;
//        egret.Tween.removeTweens(this);
//        MyTool.removeMC(this);
//        this.monsterMV.stop();
//    }
//
//    public addHp(v){
//        this.hp += v;
//        if(this.hp <= 0)
//        {
//            this.dieMV();
//        }
//    }
//
//    //有攻击目标
//    public testAtk(arr){
//        if(this.target && this.target.hp > 0 && this.target.id == this.targetID)
//        {
//            var dis = Math.abs(this.target.x - this.x);
//            if(dis <= this.vo.atkrage + this.vo.width/2 + this.target.vo.width/2)
//            {
//                this.atkMV();
//                this.stopTime = egret.getTimer() + this.vo.atkcd;
//                this.target.addHp(-this.atk);
//                return true;
//            }
//        }
//        for(var i=0;i<arr.length;i++)
//        {
//            var target = arr
//        }
//
//    }
//
//}