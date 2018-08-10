class HeroMVManager{

    private static instance: HeroMVManager;
    public static getInstance():HeroMVManager {
        if (!this.instance)
            this.instance = new HeroMVManager();
        return this.instance;
    }

    private loadedData = {}

    private _mcFactorys:Object;

    constructor(){
        this._mcFactorys = {};
    }

    public getFactory(id){
        if(this._mcFactorys[id])
            return this._mcFactorys[id];
        var path = Config.localResRoot + 'hero/';
        var data:any = this.loadedData[path + id+'.json']; //qid
        var texture:egret.Texture = this.loadedData[path + id+'.png'];
        if(data && texture)
        {
            var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            mcFactory.enableCache = true;
            this._mcFactorys[id] = mcFactory;
            return mcFactory;
        }
        return null
    }

    public getPreload(id){
        var arr = [];
        var path = Config.localResRoot + 'hero/';
        arr.push(path + id+'.png');
        arr.push(path + id+'.json');
        return arr;
    }

    public preload(id,finishFun?,temp?){
        var arr = this.getPreload(id)
        var count = 0;
        var b = false
        for(var i=0;i<arr.length;i++)
        {
            var url = arr[i];
            count ++;
            this.loadOne(url, ()=>{
                count--;
                if(count <= 0 && b && finishFun)
                    finishFun(temp);
            });
        }
        if(count == 0)
            finishFun &&  finishFun(temp);
        b = true;
    }

    private loadOne(url,fun){
        RES.getResByUrl(url, (data)=>{
            this.loadedData[url] = data;
            fun && fun();
        }, this,url.indexOf('.png') != -1?RES.ResourceItem.TYPE_IMAGE:RES.ResourceItem.TYPE_JSON);
    }
}