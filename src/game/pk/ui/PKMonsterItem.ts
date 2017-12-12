class PKMonsterItem extends game.BaseItem {
    private barGroup: eui.Group;
    private bar: eui.Rect;


    private monsterMV:MonsterMV
    public needRemove = false
    public stateMV = {};
    public addStateMV = new PKAddState();
    public constructor() {
        super();
        this.skinName = "PKMonsterItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.monsterMV = new MonsterMV();
        this.addChildAt(this.monsterMV,0)
        this.monsterMV.x = 50;
        this.monsterMV.y = 300;
        this.anchorOffsetX = 50;
        this.anchorOffsetY = 300;
        this.monsterMV.addEventListener('mv_die',this.onDieFinish,this)



        this.addChild(this.addStateMV)
        this.addStateMV.remove();
        this.addStateMV.x = 30;


        //MyTool.addTestBlock(this).y = 300;
    }

    private onDieFinish(){
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
            if(!mD.currentState[s])
                MyTool.removeMC(this.stateMV[s])
        }
        for(var s in mD.currentState)
        {
            if(!this.stateMV[s])
            {
                var txt = new eui.Label();
                txt.size = 20;
                txt.stroke = 2;
                txt.width = 160;
                txt.textAlign="center"
                txt.anchorOffsetX = 80;
                txt.textColor = 0xFFFFFF;
                txt.text = s;
                txt.x = 50;
                txt.y = 300 - mD.getVO().height - 20
                this.stateMV[s] = txt;
            }
            if(!this.stateMV[s].parent)
                this.addChild(this.stateMV[s]);
        }
    }

    //增加状态时的动画
    public  showAddStateMV(key,type){
        this.addStateMV.showState(key,type);
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
        this.addStateMV.y = this.barGroup.y - 20
        this.renewHp();

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
        this.setRota(this.x > targetX ? 1:-1)
    }

    public run(){
        var mD:PKMonsterData = this.data
        if(this.monsterMV.state != MonsterMV.STAT_RUN)
            this.monsterMV.run();
        if(mD.x != this.x)
        {
            this.setRota(this.x > mD.x ? 1:-1)
            this.x = mD.x;
        }
    }


    public stand(){
        this.monsterMV.stand();
    }

    public die(){
        this.monsterMV.die();
        this.bar.width = 0;
        this.barGroup.visible = true;
        var tw = egret.Tween.get(this.barGroup);
        tw.to({alpha:0},300)

    }

    public atk(){
        this.monsterMV.atk();
    }

    public renewHp(){
        var mD:PKMonsterData = this.data
        if(mD.mid == 99)
            return;
        if(mD.hp < mD.maxHp)
        {
            this.barGroup.visible = true;
        }
        this.bar.width = 40 * mD.getHpRate();
        this.bar.fillColor = mD.atkRota == PKConfig.ROTA_LEFT ? 0x0000FF : 0xFF0000;
    }

    public winRemove(){
        var tw = egret.Tween.get(this);
        tw.to({alpha:0},500).call(function(){
            this.needRemove = true;
        },this)
    }

    public remove(){
        this.needRemove = true;
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this.barGroup);
        MyTool.removeMC(this);
        this.monsterMV.stop();
        this.addStateMV.remove();
    }
}