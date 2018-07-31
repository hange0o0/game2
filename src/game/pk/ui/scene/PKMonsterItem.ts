class PKMonsterItem extends game.BaseItem {
    private static pool = [];
     public static createItem():PKMonsterItem{
         var item:PKMonsterItem = this.pool.pop();
         if(!item)
         {
             item = new PKMonsterItem();
         }
         item.needRemove = false;
         return item;
     }
     public static freeItem(item){
         if(!item)
             return;
         item.remove();
         if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
     }




    private barGroup: eui.Group;
    private bar: eui.Rect;
    private teamMC: eui.Image;


   public talkItm:PKTalkItem;

    public monsterMV:MonsterMV = new MonsterMV();
    public needRemove = false
    public stateMV = {};
    public addStateMV = new PKAddState();
    public constructor() {
        super();
        this.skinName = "PKMonsterItemSkin";
        this.monsterMV.addEventListener('mv_die',this.onDieFinish,this)
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;




        this.addChild(this.addStateMV)
        this.addStateMV.remove();
        this.addStateMV.x = 30;


        //MyTool.addTestBlock(this).y = 300;
    }

    private onDieFinish(){
        PKData.getInstance().actionRecord.push('die_mv_remove|' + (this.data && this.data.id))
        this.needRemove = true;
    }

    private cleanAllState(){
        for(var s in this.stateMV)
        {
            MyTool.removeMC(this.stateMV[s])
        }
    }

    public renewState(){
        var mD:PKMonsterData = this.data
        if(mD.mid == 99)
            return;
        for(var s in this.stateMV)
        {
            if(!this.stateMV[s].parent)
                continue;
            if(parseInt(s) == PKConfig.STATE_MIANSHANG)
                continue;
            if(parseInt(s) == PKConfig.STATE_MODUN)
            {
                if(mD.manaHp <= 0)
                    this.stateMV[PKConfig.STATE_MODUN].remove()
                continue;
            }
            if(!mD.currentState[s])
            {
                this.stateMV[s].remove()
            }
        }
        for(var s in mD.currentState)
        {
            if(parseInt(s) == PKConfig.STATE_MIANSHANG)
                continue;
            this.initStateMV(s)
        }

        if(mD.manaHp > 0)
            this.initStateMV(PKConfig.STATE_MODUN)
    }

    private initStateMV(s){
        var mD:PKMonsterData = this.data
        var id = parseInt(s)
        if(id == PKConfig.STATE_MOMIAN)
            return;
        if(id == PKConfig.STATE_NOBEATK)
            return;
        if(!this.stateMV[id])
        {
            var img = new PKState();
            this.stateMV[id] = img;
            img.data = id;
        }
        if(!this.stateMV[id].parent)
        {
            this.addChild(this.stateMV[id]);
            this.stateMV[id].show(this);
        }
    }

    public showMianShang(){
         this.initStateMV(PKConfig.STATE_MIANSHANG)
    }

    //增加状态时的动画
    public  showAddStateMV(key,type){
        this.addStateMV.showState(key,type);
    }

    public changeSkin(skinid){
        this.monsterMV.load(skinid)
        this.monsterMV.reset();
    }


    public dataChanged(){
        var mD:PKMonsterData = this.data
        this.needRemove = false;
        this.monsterMV.load(mD.mid)
        this.monsterMV.play();
        this.alpha = 1;
        this.cleanAllState();

        this.x = mD.x;
        this.setRota(-mD.atkRota,true);


        this.barGroup.visible = false;
        this.barGroup.alpha = 1;
        this.barGroup.y = 300 - mD.getVO().height - 20;
        this.addStateMV.y = this.barGroup.y - 30
        this.teamMC.y = this.barGroup.y - 5
        this.teamMC.visible =  mD.mid != 99
        this.renewHp();
        this.setTeam();

    }

    //public renewData(){
    //    var mD:PKMonsterData = this.data
    //
    //}

    public setRota(rota,init?){
        if(!init && this.monsterMV.scaleX == rota)
            return;
        this.monsterMV.scaleX = rota
        var mD:PKMonsterData = this.data
        this.barGroup.horizontalCenter = mD.getVO().headoff * rota;
    }
    public setRota2(targetX){
        if(this.x == targetX)
            return;
        this.setRota(this.x > targetX ? 1:-1)
    }

    public run(speed){
        speed = speed + (PKData.getInstance().playSpeed-1)*100
        var mD:PKMonsterData = this.data
        if(this.monsterMV.speed != speed)
            this.monsterMV.speed = speed;
        if(this.monsterMV.state != MonsterMV.STAT_RUN )
            this.monsterMV.run();
        if(mD.x != this.x)
        {
            this.setRota(this.x > mD.x ? 1:-1)
            this.x = mD.x;
        }
    }


    public stand(){
        if(this.monsterMV.state != MonsterMV.STAT_STAND)
            this.monsterMV.stand();
    }

    public die(){
        this.monsterMV.speed = (PKData.getInstance().playSpeed-1)*100
        this.monsterMV.die();
        this.bar.width = 0;
        this.barGroup.visible = true;
        var tw = egret.Tween.get(this.barGroup);
        tw.to({alpha:0},300)

    }

    public atk(speed){
        this.monsterMV.speed = speed + (PKData.getInstance().playSpeed-1)*100
        this.monsterMV.atk();
    }

    public setTeam(){
        var mD:PKMonsterData = this.data
        this.bar.fillColor = mD.atkRota == PKConfig.ROTA_LEFT ? 0x0000FF : 0xFF0000;
        var dec = mD.getVO().width / 2
        //this.teamMC.x = mD.atkRota == PKConfig.ROTA_LEFT ? 50-dec : 35+dec;
        this.teamMC.source = mD.atkRota == PKConfig.ROTA_LEFT ? 'card_battle2_png' : 'card_battle_png';
    }

    public renewHp(){
        var mD:PKMonsterData = this.data
        if(mD.mid == 99)
            return;
        if(mD.hp < mD.maxHp)
        {
            this.barGroup.visible = true;
            this.teamMC.visible = false;
        }
        this.bar.width = 40 * mD.getHpRate();

    }

    public winRemove(){
        var tw = egret.Tween.get(this);
        tw.to({alpha:0},500).call(function(){
            this.needRemove = true;
            PKData.getInstance().actionRecord.push('win_mv_remove|' + (this.data && this.data.id))
        },this)
    }

    public remove(){
        this.needRemove = true;
        PKData.getInstance().actionRecord.push('just_mv_remove|' + (this.data && this.data.id))
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.barGroup);
        MyTool.removeMC(this);
        this.monsterMV.stop();
        this.addStateMV.remove();
        if(this.talkItm)
        {
            PKTalkItem.freeItem(this.talkItm)
            this.talkItm = null;
        }
    }

    public talk(){
        if(this.data.mid == 99)
            return;
        if(this.data.hp < 10)
            return;
        this.talkItm = PKTalkItem.createItem();
        this.talkItm.setData(this);
        this.addChildAt(this.talkItm,0);
    }
}