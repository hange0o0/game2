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

    public createHang(){
        var arr = []
        for(var i=1;i<=18;i++)
        {
            arr.push(i)
            arr.push(i)
            arr.push(i)
        }
        var newList = [];
        for(var i=0;i<21;i++)
        {
            newList.push(ArrayUtil.randomOne(arr,true))
        }
        console.log(newList.join(','))
    }

    public test(list1,list2,view=false,hp=5){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now(),
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
            PKCode.getInstance().onStep()

            console.log(egret.getTimer() - t)
            if(PD.isWin())
                console.log('win')
            else if(PD.isDraw())
                console.log('draw')
            else
                console.log('fail')
            console.log('actionTime:' + DateUtil.getStringBySecond(Math.floor(PD.actionTime/1000)).substr(-5))
        }


    }

}
//DM.test('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')