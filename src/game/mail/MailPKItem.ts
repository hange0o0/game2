class MailPKItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "MailPKItemSkin";
    }

    private list1: eui.List;
    private list2: eui.List;
    private typeText: eui.Label;
    private nameText1: eui.Label;
    private forceText1: eui.Label;
    private forceText2: eui.Label;
    private nameText2: eui.Label;
    private headMC1: HeadMC;
    private headMC2: HeadMC;
    private viewBtn: eui.Button;
    private scoreBG: eui.Image;
    private scoreText: eui.Label;
    private timeText: eui.Label;
    private typeMC1: eui.Image;
    private typeMC2: eui.Image;








    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.headMC1,this.onHead1Click)
        this.addBtnEvent(this.headMC2,this.onHead2Click)
        this.addBtnEvent(this.viewBtn,this.onClick)

        this.list1.itemRenderer = PosListHeadItem
        this.list2.itemRenderer = PosListHeadItem
    }

    private onHead1Click(){
        var player = this.data.players[0];
        if(player.gameid == UM.gameid || player.gameid == 'npc')
            return
        OtherInfoUI.getInstance().show(player.gameid)
    }
    private onHead2Click(){
        var player = this.data.players[1];
        if(player.gameid == UM.gameid || player.gameid == 'npc')
            return
        OtherInfoUI.getInstance().show(player.gameid)
    }
    private onClick(){
        PKManager.getInstance().playReplay(this.data)
    }

    public dataChanged(){
        //var PD = PKData.getInstance()
        //var data = ObjectUtil.clone(PD.baseData)
        //data.version = Config.pk_version
        //data.type = this.pkType;
        //data.pktime = TM.now();
        //data.result = PD.getPKResult();
        //for(var i=0;i<data.players.length;i++)
        //{
        //    var players = data.players[i];
        //    delete players.autolist;
        //    delete players.card;
        //    players.actionlist = PD.getPlayer(players.id).posHistory.join(',');
        //}

        this.scoreText.text = this.data.score

        this.timeText.text = DateUtil.getStringBySeconds(Math.max(TM.now() - this.data.pktime,1),false,2) + '前 (时长：'+DateUtil.getStringBySecond(this.data.actionTime/1000).substr(-5)+')'
        switch(this.data.result)
        {
            case 1:
                this.scoreBG.source = 'title_bg1_png';
                break;
            case 2:
                this.scoreBG.source = 'title_bg7_png';
                break;
            case 3:
                this.scoreBG.source = 'title_bg8_png';
                break;
        }
        switch(this.data.type)
        {
            case PKManager.TYPE_HANG:
                this.typeText.text = '战役PK';
                break;
            case PKManager.TYPE_SLAVE:
                this.typeText.text = '奴隶PK';
                break;
            case PKManager.TYPE_FIGHT:
                this.typeText.text = '远征PK';
                break;
            case PKManager.TYPE_PVP_OFFLINE:
                this.typeText.text = '竞技场PK';
                break;
        }

        for(var i=0;i<this.data.players.length;i++)
        {
            var player = this.data.players[i];
            this.renewPlayer(i+1,player)
        }
    }

    private renewPlayer(index,data){
        this['headMC' + index].setData(data.head,data.type)
        this['forceText' + index].text = data.force;
        this['nameText' + index].text = Base64.decode(data.nick);
        MyTool.setTypeImg(this['typeMC' + index],data.type)

        var arr = [];
        var obj = {};
        var autoList = data.actionlist.split(',');
        if(!autoList[0])
            autoList = [];
        for(var i=0;i<autoList.length;i++)
        {
            var temp = autoList[i].split('#');
            var id = parseInt(temp[1]);
            if(id < 500)
                arr.push(id);
        }
        //for(var i=0;i<autoList.length;i++)
        //{
        //    var temp = autoList[i].split('#');
        //    var id = temp[1];
        //    if(!obj[id])
        //        obj[id] = {id:id,num:1,index:i}
        //    else
        //        obj[id].num ++
        //}
        //for(var s in obj)
        //{
        //    arr.push(obj[s]);
        //}
        //ArrayUtil.sortByField(arr,['num','index'],[1,0]);
        //for(var i=0;i<arr.length;i++)
        //{
        //    arr[i] = arr[i].id
        //}
        if(arr.length > 8)
            arr.length = 8;
         this['list' + index].dataProvider = new eui.ArrayCollection(arr)
    }

}