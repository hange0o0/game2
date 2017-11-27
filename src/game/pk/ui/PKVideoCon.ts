class PKVideoCon extends game.BaseContainer {
    private static instance:PKVideoCon;
    public static getInstance() {
        return this.instance;
    }

    public constructor() {
        super();
        PKVideoCon.instance = this;
        this.skinName = "PKVideoConSkin";
    }
    private con: eui.Group;
    private bg: eui.Image;



    public itemArr = []
    public itempool = []
    public txtPool = []
    public txtArr = []


    private monsterY = 300;

    public childrenCreated() {
        super.childrenCreated();

        this.bg.source = Config.localResRoot + 'map/map'+1+'.jpg';
        PKData.getInstance().addEventListener('video',this.onVideoEvent,this);
    }

    public init(){
        while(this.itemArr.length)
        {
            var item = this.itemArr.pop();
            this.freeItem(item);
        }
        while(this.txtArr.length)
        {
            var item = this.txtArr.pop();
            this.freeTxt(item);
        }
    }

    //取队伍的最前的怪
    public getFirstItem(taamID){
        var atkRota = PKData.getInstance().getTeamByID(taamID).atkRota;
        var chooseItem
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            if(item.data.atkRota != atkRota)
                continue
            if(!chooseItem)
                chooseItem = item;
            else if(atkRota == PKConfig.ROTA_LEFT && chooseItem.x<item.x)
                chooseItem = item;
            else if(atkRota == PKConfig.ROTA_RIGHT && chooseItem.x>item.x)
                chooseItem = item;
        }
        return chooseItem
    }

    private createItem():PKMonsterItem{
        var item:PKMonsterItem = this.itempool.pop();
        if(!item)
        {
            item = new PKMonsterItem();
            //item.y = 350;
        }
        item.needRemove = false;
        item.y =  this.monsterY + -25 + Math.random()*50
        return item;
    }

    private freeItem(item){
        if(!item)
            return;
        //if(item.out)
        //    return;
        //item.out = true;
        item.remove();
        this.itempool.push(item);

    }

    private createTxt():eui.Label{
        var item:eui.Label = this.txtPool.pop();
        if(!item)
        {
            item = new eui.Label();
            item.size = 20;
            item.stroke = 2;
            item.width = 160;
            item.textAlign="center"
            item.anchorOffsetX = 80;
        }
        item.alpha = 1;
        return item;
    }

    private freeTxt(item){
        if(!item)
            return;
        egret.Tween.removeTweens(item)
        MyTool.removeMC(item);
        this.txtPool.push(item);
    }

    public getItemByID(id){
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            if(item.data.id == id)
                return item;
        }
        return null;
    }

    //取出现深度
    private getIndexByY(y){
        var underItem
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            if(item.y > y)
                continue;
            if(!underItem || underItem.y < item.y)
                underItem = item;
        }
        if(underItem)
            return this.con.getChildIndex(underItem) + 1;
        return 1
    }

    public onVideoEvent(e){
        var item:PKMonsterItem;
        var videoData = e.data;
        var data:PKMonsterData = videoData.user;
        switch(videoData.type)//动画类型
        {
            case PKConfig.VIDEO_MONSTER_ADD:
                item = this.createItem();
                this.con.addChildAt(item,this.getIndexByY(item.y));
                item.data =data;
                this.itemArr.push(item);
                if(data.owner == 'sys')
                    item.y = this.monsterY;

                break;
            case PKConfig.VIDEO_MONSTER_MOVE:
                item = this.getItemByID(data.id);
                item.run();
                break;
            case PKConfig.VIDEO_MONSTER_ATK:
                item = this.getItemByID(data.id);
                if(videoData.target)
                    item.setRota2(videoData.target.x)
                item.atk();
                break;
            case PKConfig.VIDEO_MONSTER_DOUBLE:
                item = this.getItemByID(data.id);
                this.playDoubleHit(item,videoData.value);
                break;
            case PKConfig.VIDEO_MONSTER_MISS:
                item = this.getItemByID(data.id);
                this.playMiss(item);
                break;

            case PKConfig.VIDEO_MONSTER_BEATK:
                item = this.getItemByID(data.id);
                item.renewHp();
                break;
            case PKConfig.VIDEO_MONSTER_WIN:
                item = this.getItemByID(data.id);
                item.winRemove();
                break;
            case PKConfig.VIDEO_MONSTER_DIE:
                item = this.getItemByID(data.id);
                item.die();
                break;
        }
    }


    public action(){
        var item:PKMonsterItem;
        for(var i=0;i<this.itemArr.length;i++)
        {
            item = this.itemArr[i];
            if(item.needRemove)//移除过期ID
            {
                this.freeItem(item);
                this.itemArr.splice(i,1);
                i--;
            }
        }
        PKBulletManager.getInstance().actionAll()
    }

    //在AB之间播放动画
    public playAniBetween(a,b,mvID){
        var atker = this.getItemByID(a)
        var defender = this.getItemByID(b)
        if(!atker || !defender)
        {
            throw new Error('XXX')
            return;
        }
        var AM = AniManager.getInstance();
        if(AM.preLoadMV(mvID))
        {
            var xy = MyTool.getMiddleXY(atker,defender)
            xy.y -= defender.data.getVO().height/2
            var index1 = this.con.getChildIndex(atker)
            var index2 = this.con.getChildIndex(defender)
            AM.playOnItem(mvID,index1>index2?atker:defender,xy);
        }
    }

    //在A上播放动画
    public playAniOn(a,mvID){
        var atker = this.getItemByID(a)
        if(!atker)
        {
            throw new Error('XXX')
            return;
        }
        var AM = AniManager.getInstance();
        AM.playOnItem(mvID,atker);
    }
    //在A里播放动画
    public playAniIn(a,mvID){
        var atker = this.getItemByID(a)
        if(!atker)
        {
            throw new Error('XXX')
            return;
        }
        var AM = AniManager.getInstance();
        AM.playInItem(mvID,atker);
    }

    //暴击动画
    public playDoubleHit(item:PKMonsterItem,value){
         var txt = this.createTxt();
        txt.textColor = 0xFF0000;
        txt.text = '!' + value;
        txt.x = item.x;
        txt.y = item.y - item.data.getVO().height - 30;
        this.con.addChildAt(txt,item.parent.getChildIndex(item) + 1)
        this.txtArr.push(txt);

        var tw = egret.Tween.get(txt);
        tw.to({y:txt.y - 20},300).wait(200).call(function(){
            ArrayUtil.removeItem(this.txtArr,txt);
            this.freeTxt(txt);
        },this)

    }

    //MISS动画
    public playMiss(item){
        var txt = this.createTxt();
        txt.textColor = 0xFFFFFF;
        txt.text = 'miss';
        txt.x = item.x;
        txt.y = item.y - item.data.getVO().height - 30;
        this.con.addChildAt(txt,item.parent.getChildIndex(item) + 1)
        this.txtArr.push(txt);

        var tw = egret.Tween.get(txt);
        tw.to({y:txt.y - 20},300).to({alpha:0},300).call(function(){
            ArrayUtil.removeItem(this.txtArr,txt);
            this.freeTxt(txt);
        },this)
    }

}