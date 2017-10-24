class PKVideoCon extends game.BaseContainer {

    public constructor() {
        super();

        this.skinName = "PKVideoConSkin";
    }
    private con: eui.Group;
    private bg: eui.Image;



    public itemArr = []
    public itempool = []



    public childrenCreated() {
        super.childrenCreated();

        this.bg.source = 'pk_bg1_png'
    }

    public init(){
        while(this.itemArr.length)
        {
            var item = this.itemArr.pop();
            this.freeItem(item);
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
        item.y = -25 + Math.random()*50
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

    public getItemByID(id){
        for(var i=0;i<this.itemArr.length;i++)
        {
            var item = this.itemArr[i];
            if(item.data.id == id)
                return item;
        }
        return null;
    }


    public action(){
        var PD = PKData.getInstance()
        var videoList = PD.videoList;
        var item:PKMonsterItem;
        while(videoList.length > 0)
        {
            var videoData = videoList.shift();
            var data:PKMonsterData = videoData.data;
            switch(videoData.type)//动画类型
            {
                  case 'monster_add':
                      item = this.createItem();
                      this.con.addChild(item);
                      item.data =data;
                      this.itemArr.push(item);

                    break;
                  case 'monster_move':
                      item = this.getItemByID(data.id);
                      item.run();

                    break;
                  case 'monster_atk_before':
                      item = this.getItemByID(data.id);
                      item.atk();
                    break;
                  case 'monster_skill_before':
                      item = this.getItemByID(data.id);
                      item.atk();
                    break;
                  case 'monster_beAtk':
                      item = this.getItemByID(data.id);
                      item.renewHp();
                    break;
                  case 'monster_win':
                      item = this.getItemByID(data.id);
                      item.winRemove();
                    break;
                  case 'monster_die':
                      item = this.getItemByID(data.id);
                      item.die();
                    break;
            }
        }


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
    }
}