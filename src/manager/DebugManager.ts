class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public myData:any = {"vedio":-1}
    public stop = 0;
    public winCardArr;
    public testFinishFun;
    public constructor() {
        this.myData = SharedObjectManager.getInstance().getMyValue('share') || {"vedio":-1,};
    }

    public maxMonsterID = 100;
    public MML = 100;  //测试出战怪的等级
    public printDetail = false;  //打印胜出怪物

    public winMonster = {}

    public createHang(time = 1){
        while(time--)
        {
            var newList = this.randomList();;
            console.log(newList.join(','))
        }
    }

    public randomList(){
        var arr = []
        var level = 100;
        var len = 15;
        for(var s in MonsterVO.data)
        {
            var mvo = MonsterVO.data[s]
            if(mvo.level <= level)
                arr.push(mvo.id)
        }
        for(var s in SkillVO.data)
        {
            var svo = SkillVO.data[s]
            if(svo.level <= level)
                arr.push(svo.id)
        }

        var newList = [];
        for(var i=0;i<len;i++)
        {
            newList.push(ArrayUtil.randomOne(arr,true))
        }
        return newList;
    }

    public testCard(list1,list2,view=false,hp=5){
        var PD = PKData.getInstance()
        var data = {
            seed:1521192425,//TM.now(),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1,force:0,type:0,hp:hp},
                {id:2,gameid:'test2',team:2,autolist:list2,force:0,type:0,hp:hp}
            ]
        };
        var t = egret.getTimer();
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(data);
        if(view)
        {
           PKingUI.getInstance().show();
        }
        else
        {
            PD.quick = true;
            PD.start();
            //PD.addDiamondMonster();
            PKCode.getInstance().onStep()

            console.log('result:' + PD.getPKResult())
            console.log(egret.getTimer() - t)
            console.log('actionTime:' + DateUtil.getStringBySecond(Math.floor(PD.actionTime/1000)).substr(-5))
            console.log(PD.actionTime)
        }
    }


    private testNum = 0;
    public test(){
        this.testNum = 0;
        this.stop = 0;
        this.winMonster = {};
        setTimeout(()=>{
            this.testRound();
        },1);

    }

    private printResult(){
        var arr = [];
        for(var s in MonsterVO.data)
        {
            arr.push({id:s,num:this.winMonster[s] || 0})
        }
        for(var s in SkillVO.data)
        {
            arr.push({id:s,num:this.winMonster[s] || 0})
        }
        ArrayUtil.sortByField(arr,['num'],[1]);
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i].id;
            console.log('id:' +id +  '\t\tnum:' +  arr[i].num + '\t\tcost:' +  CM.getCardVO(id).cost + '\t\tname:' +  CM.getCardVO(id).name)
        }
    }

    //N选1;
    private testRound(){
        var t = egret.getTimer()
        this.testNum ++;
        var arr = []
        var n = 512;
        for(var i=0;i<n;i++)
        {
             arr.push(this.randomList().join(','))
        }
        var num = 0;
        while(arr.length >2)
        {
             arr = arr.concat(this.testOne(arr.shift(),arr.shift()))
            num ++;
            if(num> n+2)
                break;
        }
        arr = this.testOne(arr.shift(),arr.shift())
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split(',');
            for(var j=0;j<temp.length;j++)
            {
                 var id = temp[j];
                if(this.winMonster[id])
                    this.winMonster[id] ++;
                else
                    this.winMonster[id] = 1;
            }
        }
        console.log(this.testNum + ':' + (egret.getTimer()-t))
        if(this.stop)
        {
            this.printResult();
            return;
        }

        egret.callLater(this.testRound,this)
    }

    private testOne(list1,list2){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1,force:0,type:0,hp:5},
                {id:2,gameid:'test2',team:2,autolist:list2,force:0,type:0,hp:5}
            ]
        };
        var t = egret.getTimer();
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(data);
        PD.quick = true;
        PD.start();
        PKCode.getInstance().onStep()
        var winlist;
        if(PD.isWin())
        {

            return [list1];
        }
        else if(PD.isDraw())
        {
            return [list1,list2];
        }
        else
        {
            return [list2];
        }
    }

}
//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')