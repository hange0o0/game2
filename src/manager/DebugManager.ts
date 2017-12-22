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

}

//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')